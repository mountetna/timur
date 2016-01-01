class PlotTypesJson
  class << self
    def template
      {
        plots: [
          {
            name: "XY Scatter",
            type: "ScatterPlot"
          },
          {
            name: "Box Plot",
            type: "BoxPlot"
          }
        ],
        template: {
          indications: [ "Any" ] + Experiment.select_map(:name),
          stains: [ :treg, :nktb, :sort, :dc ],
          populations: get_population_names_by_stain,
          mfis: get_mfi_by_populations,
          clinicals: get_clinical_names_by_indication
        }
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
end
