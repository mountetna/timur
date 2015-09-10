class ScatterPlotJson
  include PlotHelper
  include PopulationHelper

  VARIABLES = [
    "CD4-CD8-/CD3 all" ,
    "CD14+ TAM/CD45+",
    "BDCA3+/HLADR+",
    "CD4+CD8+/CD3 all",
    "Tr/Th"
  ]

  def initialize params
    @x_var = params[:x_var]
    @y_var = params[:y_var]
    @indication = Experiment[name: params[:indication] ]
  end

  def get_variable var, sample_id
    case var
    when "CD4-CD8-/CD3 all"
      compute_ratio "Q4: CD8a- , CD4-##CD3+ all", "CD3+ all" do |name|
        sample_count(populations, sample_id, :treg, name)
      end
    when "CD14+ TAM/CD45+"
      compute_ratio "CD14+ TAMs", "CD45+" do |name|
        sample_count(populations, sample_id, :dc, name)
      end
    when "BDCA3+/HLADR+"
      compute_ratio "BDCA3+ DCs", "HLADR+" do |name|
        sample_count(populations, sample_id, :dc, name)
      end
    when "CD4+CD8+/CD3 all"
      compute_ratio "Q2: CD8a+ , CD4+##CD3+ all", "CD3+ all" do |name|
        sample_count(populations, sample_id, :treg, name)
      end
    when "Tr/Th"
      compute_ratio "CD3 all, CD4+, CD25+, FoxP3+ (Tr)", "CD3 all, CD4+, CD25- (Th)" do |name|
        sample_count(populations, sample_id, :treg, name)
      end
    end
  end

  def to_json
    # you should return an array of objects with name, x/y pairs, and colors
    {
      plot: {
          name: 'scatter',
          width: 800,
          height: 350,
          margin: { top: 10, right: 150, bottom: 150, left: 150},
      },
      xlabel: @x_var,
      ylabel: @y_var,
      data: x_y_data
    }
  end
  def x_y_data
    sample_id_hash.map do |sample_id, sample_name|
      value = {
        name: sample_name,
        x: get_variable( @x_var, sample_id ),
        y: get_variable( @y_var, sample_id )
      }
      value if value[:x] && value[:y]
    end.compact
  end
end
