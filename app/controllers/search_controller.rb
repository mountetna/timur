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
      filename = "#{params[:model_name]}.tsv"
      response.headers['Content-Type'] = 'text/tsv'
      response.headers['Content-Disposition'] = %Q( attachment; filename="#{filename}" )

      Magma::Client.instance.retrieve(
        token,
        params[:project_name],
        model_name: params[:model_name],
        record_names: params[:record_names],
        attribute_names: 'all',
        filter: params[:filter],
        format: 'tsv'
      ) do |magma_response |
        magma_response.read_body do |chunk|
          response.stream.write(chunk)
        end
        response.stream.close
      end
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

  def question_json
    begin
      magma = Magma::Client.instance
      response = magma.query(
        token, params[:project_name],
        params[:question]
      )
      render json: response.body
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def consignment_json
    begin
      consignment = Hash[
        params[:queries].map do |query|
          [
            query[:name],
            Archimedes::Manifest.create(
              token,
              params[:project_name],
              query[:manifest]
            ).payload
          ]
        end
      ]
      render(json: consignment)
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    rescue LanguageError => e
      render(json: { errors: [e.message] }, status: 422)
    end
  end
end

