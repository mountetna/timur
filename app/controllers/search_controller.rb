require "csv"

class SearchController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  layout "timur"

  def index
  end

  def templates_json
    payload = Magma::Payload.new()
    Magma.instance.magma_models.map do |model|
      payload.add_model model
    end
    render json: TimurPayload.new(payload)
  end

  def table_json
    # This should mimic the format of the 'table' attribute:
    model = Magma.instance.get_model params[:model_name]

    query = model.retrieve do |att|
      !att.is_a? Magma::TableAttribute
    end

    if params[:filter]
      query = QueryFilter.new(model, query, params[:filter]).query
    end

    # For the table query we only give a list of identifiers
    record_names = query.select_map(:"#{model.table_name}__#{model.identity}")

    render json: { record_names: record_names }
  end

  def table_tsv
    model = Magma.instance.get_model params[:model_name]

    attributes = model.attributes.values.select do |att|
      !att.is_a? Magma::TableAttribute
    end

    query = model.retrieve do |att|
      attributes.include? att
    end

    if params[:filter]
      query = QueryFilter.new(model, query, params[:filter]).query
    end

    records = query.all

    if !model.has_identifier?
      attributes.unshift :id
    end

    filename = "#{params[:model_name]}.tsv"
    csv = create_csv(records, attributes)
    send_data(csv, type: 'text/tsv', filename: filename)
  end

  private

  def create_csv(records, attributes)
    CSV.generate(col_sep: "\t") do |csv|
      csv << attributes.map do |att| att == :id ? att : att.name; end
      records.each do |record|
        csv << attributes.map do |att|
          if att == :id
            record[att]
          else
            att.txt_for record
          end
        end
      end
    end
  end

  public

  def records_json
    model = Magma.instance.get_model params[:model_name]

    # eager load from links but not tables
    
    attributes = model.attributes.values.select do |att|
      !att.is_a? Magma::TableAttribute
    end

    records = model.retrieve(params[:record_names]) do |att|
      attributes.include? att
    end.all

    payload = Magma::Payload.new
    payload.add_model model, attributes.map(&:name)
    payload.add_records model, records
    
    render json: TimurPayload.new( payload )
  end

  # TODO: this needs to be refactored to use the Payload interface along with
  # column restriction, not yet working
  def identifiers_json
    render json: {
      templates: Hash[
        Magma.instance.magma_models.map do |model|
          next unless model.has_identifier?
          identifiers = model.select_map(model.identity)
          next if identifiers.empty?
          [
            model.model_name,
            {
              documents: Hash[
                identifiers.map do |name|
                  [ name, { model.identity => name } ]
                end
              ]
            }
          ]
        end.compact
      ]
    }
  end
end

