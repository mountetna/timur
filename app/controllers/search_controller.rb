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
      attribute_names: "all"
    )

    payload = JSON.parse(payload)

    model = payload["models"][params[:model_name]]
    template = model["template"]

    records = model["documents"].values_at(*params[:record_names])
    attributes = template["attributes"].keys

    attributes.unshift("id") if template["identifier"] == "id"

    filename = "#{params[:model_name]}.tsv"
    csv = create_csv(records, attributes, template)
    send_data(csv, type: 'text/tsv', filename: filename)
  end

  private

  def create_csv(records, attributes, template)
    CSV.generate(col_sep: "\t") do |csv|
      csv << attributes.select do |att_name|
          att = template["attributes"][att_name]
          !att || att["shown"]
      end
      records.each do |record|
        csv << attributes.map do |att_name|
          att = template["attributes"][att_name]
          next if att && !att["shown"]
          case att["attribute_class"]
          when "Magma::ImageAttribute", "Magma::DocumentAttribute"
            record[att_name] ? record[att_name]["url"] : nil
          when "Magma::TableAttribute"
            nil
          when "Magma::CollectionAttribute"
            record[att_name].join(", ")
          else
            record[att_name]
          end
        end
      end
    end
  end

  public

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

