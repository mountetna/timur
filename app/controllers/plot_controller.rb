class PlotController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  layout "timur"

  def index
  end

  def update_saves
    current_user.saves = params[:saves]
    current_user.save
    render json: :ok
  end

  def scatter_plot_json
    plot = ScatterPlotJson.new(params)
    render json: plot.to_json
  end

  def fixed_plots_json
    # JSON description of available fixed plots
    render json: {
      plots: [
        ScatterPlotJson.template
      ],
      saves: current_user.saves
    }
  end
end
