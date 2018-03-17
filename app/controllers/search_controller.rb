require 'csv'

class SearchController <  ApplicationController
  include ActionController::Live
  before_filter :authenticate
  before_filter :readable_check
  layout 'timur'

  def index
    @project_name = params[:project_name]
  end

  def table_tsv
    begin
      filename = "#{params[:model_name]}.tsv"
      response.headers['Content-Type'] = 'text/tsv'
      response.headers['Content-Disposition'] = %Q( attachment; filename="#{filename}" )

      retrieve_args = [
        token,
        params[:project_name],
        model_name: params[:model_name],
        record_names: params[:record_names],
        attribute_names: 'all',
        filter: params[:filter],
        format: 'tsv'
      ]

      Magma::Client.instance.retrieve(*retrieve_args) do |magma_response|
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
    response = magma_error_wrapper do
      Magma::Client.instance.retrieve(
        token,
        params[:project_name],
        params
      )
    end

    render(response)
  end

  def question_json
    response = magma_error_wrapper do
      Magma::Client.instance.query(
        token,
        params[:project_name],
        params[:question]
      )
    end

    render(response)
  end

  def consignment_json
    begin
      consignment = Hash[
        params[:queries].map do |query|
          [
            query[:name],
            Archimedes::Manifest.new(
              token,
              params[:project_name],
              query[:manifest]
            ).payload
          ]
        end
      ]
      render(json: consignment)
    rescue Archimedes::LanguageError => e
      render(json: e.body, status: 422)
    end
  end

  private

  def magma_error_wrapper
    begin
      magma_response = yield
      if magma_response.code != '200'
        raise Magma::ClientError.new(magma_response.code, magma_response.body)
      end
      return {json: magma_response.body}
    rescue Magma::ClientError => e
      return {
        json: {error: e.body.to_s, type: 'Magma', status: e.status},
        status: 200
      }
    end
  end
end
