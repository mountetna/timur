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
    if params[:analysis]
      pythia_json( matrix, params[:analysis])
      return
    end
    render json: matrix.to_json
  end

  def plot_types_json
    # JSON description of available fixed plots
    render json: PlotTypesJson.template.merge(
      saves: current_user.saves,
      default_mappings: User::DEFAULT_MAPPINGS
    )
  end

  private 

  def pythia_json( matrix, analysis )
    matrix_json = matrix.to_json
    response = pythia_get( {
      input: matrix_json,
      params: analysis
    } )

    render json: matrix_json.update({ 
      pythia_response: JSON.parse(response.body)
    })
  end

  def pythia_get data
    uri = URI.parse(Rails.configuration.pythia_url+"json/")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    request = Net::HTTP::Post.new(uri.request_uri)
    request.basic_auth(
      Rails.application.secrets.pythia_auth_user,
      Rails.application.secrets.pythia_auth_passwd
    )
    request.body = data.to_json
    request["Content-Type"] = "application/json"
    response = http.request(request)
  end
end
