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
 
  def table
    @name = params[:model]
    model = Magma.instance.get_model @name.to_sym
    filename = "#{@name}.tsv"
    csv = create_csv(model)
    send_data(csv, type: 'text/tsv', filename: filename)
  end
 
  private
 
  def create_csv(model)
    csv_headers = model.attributes.select do |name,att|
      att.tab_column?
    end.keys
 
    CSV.generate(col_sep: "\t") do |csv|
      csv << csv_headers
      model.all.each do |m|
        csv << csv_headers.map do |n|
          model.attributes[n].json_for(m)
        end
      end
    end
  end 
end

