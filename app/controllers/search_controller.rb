require "csv"

class SearchController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  layout "timur"

  def index
  end

  def json
    render json: {
      magma_models: Magma.instance.magma_models.map do |model|
        model.json_template
      end
    }
  end

  def table_json
    # This should mimic the format of the 'table' attribute:
    model = Magma.instance.get_model params[:model]
    render json: {
      model: JsonUpdate::Template.new(model).patched_template,
      records: model.all.map do |item|
        item.json_document
      end
    }
  end
end

