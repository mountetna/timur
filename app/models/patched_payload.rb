class PatchedPayload
  def initialize payload
    @payload = payload
  end

  def to_json(options={})
    {
      templates: @payload.template_payloads.map do |model, tp|
        { 
          model.model_name => patch(model, tp)
        }
      end.reduce(:merge)
    }.to_json(options)
  end

  def patch model, template_payload
    {
      documents: template_payload.records.map do |record|
        {
          record.identifier => JsonUpdate.default_document(record,model)
        }
      end.reduce(:merge),
      patched_documents: template_payload.records.map do |record|
        {
          record.identifier => JsonUpdate.updated_document(record,model)
        }
      end.reduce(:merge),
      template: JsonUpdate.default_template(model),
      patched_template: JsonUpdate.updated_template(model),
    }
  end
end
