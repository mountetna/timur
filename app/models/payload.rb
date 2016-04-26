class TemplatePayload
  # create a json template for a model
  def initialize model
    @model = model
  end
end

class DocumentPayload
  # create a json document for a record
end


class Payload
  def initialize model, records
    @model = model
    @records = records
    @models = {}
  end

  def add_model model
    @models[model] = TemplatePayload.new(model)
  end

  def add_record model, record
    @models[model].add_record record
  end

  def to_json(options={})
    json_payload( @model, @records ).to_json(options)
  end

  private

  def templates
    @templates ||= dependent_models @model
  end

  def dependent_models model
    others = model.attributes.map do |name, att|
      next unless att.is_a? Magma::TableAttribute
      att.link_model
    end.compact
    child_models = others.map do |child_model|
      dependent_models child_model
    end
    [ model, child_models ].flatten.uniq
  end

  def json_payload model, records
    {
      documents: records.map do |record|
        {
          record.identifier => JsonUpdate.default_document(record,model)
        }
      end.reduce(:merge),
      patched_documents: records.map do |record|
        {
          record.identifier => JsonUpdate.updated_document(record,model)
        }
      end.reduce(:merge),
      template: JsonUpdate.default_template(model),
      patched_template: JsonUpdate.updated_template(model),
    }
  end
end
