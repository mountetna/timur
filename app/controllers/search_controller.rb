require "csv"

class SearchController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  layout "timur"

  def index
  end

  def table_json
    begin
      status, payload = Magma::Client.instance.query(
        [ params[:model_name], "::all", "::identifier" ]
      )

      ids = JSON.parse(payload)

      render json: { record_names: ids["answer"].map(&:last) }
    rescue Magma::ClientError => e
      render json: e.body, status: e.status
    end
  end

  def table_tsv
    begin
      status, payload = Magma::Client.instance.retrieve(
        model_name: params[:model_name],
        record_names: params[:record_names],
        attribute_names: "all",
        format: "tsv"
      )
      filename = "#{params[:model_name]}.tsv"
      send_data(payload, type: 'text/tsv', filename: filename)
    rescue Magma::ClientError => e
      render json: e.body, status: e.status
    end
  end

  def records_json
    begin
      magma = Magma::Client.instance
      status, payload = magma.retrieve(
        params
      )
      render json: payload
    rescue Magma::ClientError => e
      render json: e.body, status: e.status
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
      render json: e.body, status: e.status
    rescue LanguageError => e
      render json: { errors: [ e.message ] }, status: 422
    end
  end
end

