class TimurPayload
  def initialize payload
    @payload = payload
  end

  def to_hash
    {
      templates: Hash[
        @payload.template_payloads.map do |model, tp|
          [ 
            model.model_name, patch(model, tp)
          ]
        end
      ]
    }
  end

  def to_json
    MultiJson.dump(to_hash)
  end

  private

  def patch model, template_payload
    {
      documents: Hash[
        template_payload.records.map do |record|
          [
            record.identifier, JsonUpdate.default_document(record,model)
          ]
        end
      ],
      template: JsonUpdate.default_template(model)
    }
  end
end
