require 'csv'
require 'digest'

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
    manifests = params[:queries].map do |manifest|
      process_manifest(manifest)
    end

    # We return the consignments with the md5 of the manifest data as the key.
    render(fetch_consignments(manifests))
  end

  def consignment_by_manifest_id_json

    # Pull the manifests by their ids.
    manifests = params[:manifest_ids].map do |manifest_id|
      process_manifest(Manifest.find_by_id(manifest_id))
    end

    # We return the consignments with the md5 of the manifest data as the key.
    render(fetch_consignments(manifests))
  end

  private

  def process_manifest(manifest)
    # Append the record name to the manifest as it needs it for processing.
    manifest_elements = [
      ['record_name', "'#{params[:record_name]}'"]
    ]

    # Translate the manifests into a form usable by DataManifest.
    manifest[:data]['elements'].each do |manifest_element|
      manifest_elements.push([
        manifest_element['name'],
        manifest_element['script']
      ])
    end

    {
      md5sum_data: Digest::MD5.hexdigest(manifest['data'].to_json),
      name: manifest[:name],
      manifest_elements: manifest_elements
    }
  end

  def fetch_consignments(queries)
    begin
      consignment = Hash[
        queries.map do |query|
          [
            query[:md5sum_data],
            Archimedes::Manifest.new(
              token,
              params[:project_name],
              query[:manifest_elements]
            ).payload
          ]
        end
      ]
      return {json: consignment}
    rescue Magma::ClientError => e
      return {
        json: {error: e.body.to_s, type: 'Magma', status: e.status},
        status: 200
      }
    rescue Archimedes::LanguageError => e
      return {
        json: {error: e.message.to_s, type: 'Archimedes', status: e.status},
        status: 200
      }
    end
  end

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
