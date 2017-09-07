require 'csv'

class SearchController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  layout 'timur'

  def index
    @project_name = params[:project_name]
  end

  def table_json
    begin
      req_obj = [params[:model_name], '::all', '::identifier']
      status, payload = Magma::Client.instance.query(
        token, params[:project_name], req_obj
      )
      ids = JSON.parse(payload)
      render(json: { record_names: ids['answer'].map(&:last) })
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def table_tsv
    begin
      req_obj = {
        model_name: params[:model_name],
        record_names: params[:record_names],
        attribute_names: 'all',
        format: 'tsv'
      }

      status, payload = Magma::Client.instance.retrieve(
        token, params[:project_name],
        req_obj
      )

      filename = "#{params[:model_name]}.tsv"
      send_data(payload, {type: 'text/tsv', filename: filename})
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def records_json
    begin
      status, payload = Magma::Client.instance.retrieve(token, params[:project_name], params)
      render(json: payload)
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def query_json
    begin
      result = Hash[
        params[:queries].map do |query|
          manifest = DataManifest.new(token, params[:project_name], query[:manifest])
          manifest.fill
          [query[:name], manifest.payload]
        end
      ]
      render(json: result)
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    rescue LanguageError => e
      render(json: { errors: [e.message] }, status: 422)
    end
  end
end

