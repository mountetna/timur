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

  def pythia_json
    matrix_json = DataMatrix.new(params,current_user).to_json

    data = {
      "method" => "correlation",
      "matrix" => matrix_json[:data][0][:values],
      "columns" => "true"
    }.to_json

    uri = URI.parse('https://dev.ucsf-immunoprofiler.org/pythia/json/');
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.request_uri)
    request.basic_auth(
      Rails.application.secrets.pythia_auth_user,
      Rails.application.secrets.pythia_auth_passwd
    )
    request.body = data
    request["Content-Type"] = "application/json"
    response = http.request(request)

    Rails.logger.info response.body

    render json: matrix_json
  end

  def plot_types_json
    # JSON description of available fixed plots
    render json: PlotTypesJson.template.merge(
      saves: current_user.saves,
      default_mappings: User::DEFAULT_MAPPINGS
    )
  end
end
