class TimurPayload
  def initialize
    @payload = {}
  end

  def add type, record
    @payload[type] ||= {}
    @payload[type][record.name] = record
  end

  def to_json(options=nil)
    MultiJson.dump(to_hash)
  end
  
  def to_hash
    Hash[
      @payload.map do |type,records|
        [
          type,
          Hash[
            records.map do |record_name, record|
              [ record_name, record.to_hash ]
            end
          ]
        ]
      end
    ]
  end
end
