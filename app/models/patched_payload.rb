class PatchedPayload
  def initialize payload, simple=nil
    @payload = payload
    @simple = simple
  end

  def simple?
    @simple
  end

  def to_json(options={})
    MultiJson.dump(
      {
        templates: Hash[
          @payload.template_payloads.map do |model, tp|
            [ 
              model.model_name, patch(model, tp)
            ]
          end
        ]
      }
    )
  end

  def patch model, template_payload
    template = {
      documents: Hash[
        template_payload.records.map do |record|
          [
            record.identifier, JsonUpdate.default_document(record,model)
          ]
        end
      ],
      template: JsonUpdate.default_template(model)
    }

    if !simple?
      template.update({
        patched_documents: Hash[
          template_payload.records.map do |record|
            [
              record.identifier, JsonUpdate.updated_document(record,model)
            ]
          end
        ],
        patched_template: JsonUpdate.updated_template(model),
      })
    end

    template
  end
end
