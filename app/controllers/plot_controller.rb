class PlotController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  layout "timur"

  def index
  end

  def scatter_plot_json
    plot = ScatterPlot.new(params)
    render json: plot.to_json
  end

  def fixed_plots_json
    # JSON description of available fixed plots
    plots = [
      {
        name: "None",
        type: "none"
      },
      {
        name: "XY Scatter",
        type: "Scatter",
        indications: Experiment.select_map(:name),
        variables: ScatterPlot::VARIABLES
      }
    ]
    render json: plots
  end

  private
end
