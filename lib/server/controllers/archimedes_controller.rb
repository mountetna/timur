require_relative '../../../app/models/archimedes'

class ArchimedesController <  Timur::Controller
  def consignment
    manifests = nil

    if @params[:queries]
      manifests = @params[:queries].map do |manifest|
        process_manifest(manifest)
      end
    end

    if @params[:manifest_ids]
      manifests = @params[:manifest_ids].map do |manifest_id|
        process_manifest(Manifest[manifest_id])
      end
    end

    # We return the consignments with the md4 of the manifest data as the key.
    success_json(fetch_consignments(manifests))
  end

  private

  def process_manifest(manifest)
    # Append the record name to the manifest as it needs it for processing.
    manifest_elements = [
      ['record_name', "'#{@params[:record_name]}'"]
    ]

    # Translate the manifests into a form usable by DataManifest.
    data = JSON.parse(manifest[:data].to_json, symbolize_names: true)

    data[:elements].each do |manifest_element|
      manifest_elements.push([
        manifest_element[:name],
        manifest_element[:script]
      ])
    end

    {
      md5sum_data: Digest::MD5.hexdigest(manifest[:data].to_json),
      name: manifest[:name],
      manifest_elements: manifest_elements
    }
  end

  def fetch_consignments(queries)
    begin
      consignments =  Hash[
        queries.map do |query|
          [
            query[:md5sum_data],
            Archimedes::Manifest.new(
              token,
              @params[:project_name],
              query[:manifest_elements]
            ).payload
          ]
        end
      ]
      return consignments
    rescue Magma::ClientError => e
      @logger.warn e.message
      raise Etna::BadRequest, e.body.to_s
    rescue Archimedes::LanguageError => e
      raise Etna::BadRequest, e.message.to_s
    end
  end
end

