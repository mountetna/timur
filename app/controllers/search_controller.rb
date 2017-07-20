require 'csv'

class SearchController <  ApplicationController
  include ActionController::Live
  before_filter :authenticate
  before_filter :readable_check
  layout 'timur'

  def index
    @project_name = params[:project_name]
  end

  def table_json
    begin
      response = Magma::Client.instance.query(
        token, params[:project_name],
        [ params[:model_name], "::all", "::identifier" ]
      )
      ids = JSON.parse(payload)
      render(json: { record_names: ids['answer'].map(&:last) })
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def table_tsv
    begin
      magma_response = Magma::Client.instance.retrieve(
        token, params[:project_name],
        model_name: params[:model_name],
        record_names: params[:record_names],
        attribute_names: 'all',
        format: 'tsv'
      )

      filename = "#{params[:model_name]}.tsv"
      response.headers['Content-Type'] = 'text/tsv'
      response.headers['Content-Disposition'] = %Q( attachment; filename="#{filename}" )
      magma_response.read_body do |chunk|
        response.stream.write(chunk)
      end
      response.stream.close
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def records_json
    begin
      magma = Magma::Client.instance
      response = magma.retrieve(
        token, params[:project_name],
        params
      )
      render json: response.body
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

