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
    matrix = DataMatrix.new(params,current_user)
    render json: matrix.to_json
  end

  def plot_types_json
    # JSON description of available fixed plots
    render json: PlotTypesJson.template.merge(
      saves: current_user.saves
    )
  end
end
