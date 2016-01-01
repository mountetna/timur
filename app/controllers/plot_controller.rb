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

  def plot_json
    plot_types = PlotTypesJson.template[:plots].map do |plot|
      plot[:type]
    end

    if plot_types.include? params[:type]
      plot = Object.const_get(params[:type].to_sym).new(params)
      render json: plot.to_json
    else
      render json: {}, status: 422
    end
  end

  def plot_types_json
    # JSON description of available fixed plots
    render json: PlotTypesJson.template.merge(
      saves: current_user.saves
    )
  end
end
