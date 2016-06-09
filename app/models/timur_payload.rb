class TimurPayload
  def initialize payload
    @payload = payload
  end

  def to_json(options=nil)
    MultiJson.dump(to_hash)
  end
  
  def to_hash
    @payload.to_hash do |model,attributes,record|
      if record
        record.json_document(attributes)
      else
        JsonUpdate.updated_template(model)
      end
    end
  end
end
