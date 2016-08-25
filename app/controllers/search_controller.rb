require "csv"

class SearchController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  layout "timur"

  def index
  end

  def json
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
    record_names = query.select_map(model.identity)

    render json: { record_names: record_names }
  end

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

