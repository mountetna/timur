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
    render json: PatchedPayload.new(payload,true)
  end

  def table_json
    # This should mimic the format of the 'table' attribute:
    model = Magma.instance.get_model params[:model_name]
    records = model.all

    payload = Magma::Payload.new
    payload.add_model model
    payload.add_records model, records

    render json: PatchedPayload.new( payload, true )
  end
end

