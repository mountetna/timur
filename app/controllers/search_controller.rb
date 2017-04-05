require "csv"

class SearchController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  layout "timur"

  def index
  end

  def templates_json
    magma = Magma::Client.instance
    status, payload = magma.retrieve(
      model_name: "all",
      record_names: [],
      attribute_names: "all"
    )
    if status == 200
      render json: payload
    else
      render json: payload, status: status
    end
  end

  def table_json
    # Ask Magma a question to get record names matching this thing
    
    status, payload = Magma::Client.instance.query(
      [ params[:model_name], "::all", "::identifier" ]
    )

    ids = JSON.parse(payload)

    render json: { record_names: ids["answer"].map(&:last) }
  end

  def table_tsv
    status, payload = Magma::Client.instance.retrieve(
      model_name: params[:model_name],
      record_names: params[:record_names],
      attribute_names: "all",
      format: "tsv"
    )
    filename = "#{params[:model_name]}.tsv"
    send_data(payload, type: 'text/tsv', filename: filename)
  end

  def records_json
    magma = Magma::Client.instance
    status, payload = magma.retrieve(
      params
    )
    if status == 200
      render json: payload
    else
      render json: payload, status: status
    end
  end

  def query_json
    begin
      result = Hash[
        params[:queries].map do |query|
          manifest = DataManifest.new(query[:manifest])
          manifest.fill
          [ query[:name], manifest.payload ]
        end
      ]
      render json: result
    rescue Magma::ClientError => e
      render json: e.body.merge(message: e.message), status: e.status
    end
  end
 
  # TODO: this needs to be refactored to use the Payload interface along with
  # column restriction, not yet working
  def identifiers_json
    magma = Magma::Client.instance
    status, payload = magma.retrieve(
      model_name: "all",
      record_names: "all",
      attribute_names: "identifier"
    )
    if status == 200
      render json: payload
    else
      render json: payload, status: status
    end
  end
end

