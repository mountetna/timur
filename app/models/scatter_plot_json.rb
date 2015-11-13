class ScatterPlotJson
  include PlotHelper
  include PopulationHelper

  class << self
    def template
      {
        name: "XY Scatter",
        type: "Scatter",
        indications: [ "Any" ] + Experiment.select_map(:name),
        colors: {
          red: '#ff0000',
          blue: '#0000ff',
          green: '#00ff00'
        },
        stains: [ :treg, :nktb, :sort, :dc ],
        populations: get_population_names_by_stain,
        mfis: get_mfi_by_populations,
        clinicals: get_clinical_names_by_indication
      }
    end

    private
    def get_mfi_by_populations
      Mfi.join(:populations, id: :population_id)
        .distinct(:stain, :ancestry, :populations__name, :mfis__fluor)
        .select_hash_groups(:stain, [:populations__name___pop_name, :ancestry, :mfis__fluor___mfi_fluor]).map do |stain,pops|
        {
          stain => pops.group_by do |pop|
            pop[0] + '##' + pop[1]
          end.map do |key, value|
            {
              key => value.map(&:last)
            }
          end.reduce(:merge)
        }
      end.reduce(:merge)
    end

    def get_population_names_by_stain
      Population.distinct(:stain, :ancestry, :name).select_hash_groups(:stain, [ :name, :ancestry ]).map do |stain,pops|
        { 
          stain => pops.map do |name,ancestry|
            {
              name: name,
              ancestry: ancestry
            }
          end.sort_by do |pop|
            pop[:name]
          end
        }
      end.reduce :merge
    end

    def get_clinical_names_by_indication
      Clinical.order
        .join(:patients, clinical_id: :id)
        .join(:experiments, experiments__id: :patients__experiment_id)
        .join(:parameters, clinical_id: :clinicals__id)
        .distinct(:experiments__name, :parameters__name, :parameters__value)
        .select_hash_groups(:experiments__name___experiments_name,
          [:parameters__name___parameters_name, :parameters__value]).map do |exp, params|
          {
            exp => params.group_by(&:first).map do |name, array|
              { name => array.map(&:last) }
            end.reduce(:merge)
          }
      end.reduce :merge
    end
  end

  VARIABLES = [
    "CD4-CD8-/CD3 all" ,
    "CD14+ TAM/CD45+",
    "BDCA3+/HLADR+",
    "CD4+CD8+/CD3 all",
    "Tr/Th"
  ]

  def initialize params
    @x_var = params[:x]
    @y_var = params[:y]
    @series = params[:series]
    @samples = {}
    @populations = {}
  end

  def to_json
    # you should return an array of objects with name, x/y pairs, and colors
    {
      plot: {
          name: 'scatter',
          width: 900,
          height: 300,
          margin: { top: 30, right: 250, bottom: 30, left: 150},
      },
      xlabel: label_for(@x_var),
      ylabel: label_for(@y_var),
      series: x_y_data_by_series
    }
  end

  private 

  def get_relation var, sample_id, populations
    case var[:type]
    when "Population Fraction"
      compute_operation(:/, var[:v1], var[:v2], discard_null: true) do |name|
        sample_count(populations, sample_id, var[:stain].to_sym, name)
      end
    when "MFI"
      mfi_value(populations, sample_id, var[:stain], var[:population], var[:mfi])
    end
  end

  def label_for var
    case var[:type]
    when "Population Fraction"
      "#{var[:v1].sub(/##.*/,'')} / #{var[:v2].sub(/##.*/,'')} (#{var[:stain]})"
    when "MFI"
      "#{var[:population].sub(/##.*/,'')} #{var[:mfi]} (#{var[:stain]})"
    end
  end

  def populations series
    @populations[series] ||= Population.where(sample_id: sample_id_hash(series).keys).all
  end

  def sample_id_hash series
    # if there is no indication, just return all samples
    @samples[series] ||=
      begin
        samples = Sample.join(:patients, id: :patient_id)
        if series[:indication] && series[:indication] != "Any"
          indication = Experiment[name: series[:indication] ]
          samples = samples.where(experiment_id: indication.id)
        end
        if series[:clinical_value]
          samples = samples.join(:clinicals, id: :patients__clinical_id)
            .join(:parameters, clinicals__id: :parameters__clinical_id)
            .where(parameters__name: series[:clinical_name])
            .where(parameters__value: series[:clinical_value])
        end
        samples.select_hash(:samples__id, :samples__sample_name)
      end
  end
  
  def x_y_data_by_series
    @series.map do |name,series|
      x_y_data(series)
    end
  end

  def x_y_data series
    samples = sample_id_hash(series)
    Rails.logger.info series
    {
      values: samples.map do |sample_id, sample_name|
        value = {
          name: sample_name,
          x: get_relation( @x_var, sample_id, populations(series) ),
          y: get_relation( @y_var, sample_id, populations(series) )
        }
        value if value[:x] && value[:y]
      end.compact,
      name: series[:name],
      color: series[:color]
    }
  end
end
