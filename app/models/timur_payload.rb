class TimurPayload
  def initialize payload
    @payload = payload
  end

  def to_json
    MultiJson.dump(@payload.to_hash do |model,attributes,record|
      if record
        record.json_document(attributes)
      else
        JsonUpdate.default_template(model,attributes)
      end
    end)
  end
end
