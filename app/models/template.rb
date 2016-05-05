class Template
  def initialize model, records
    @model = model
    @records = records
  end

  def to_hash
    {
      name: @model.name.snake_case,
      template: JsonUpdate.default_template(@model),
      patched_template: JsonUpdate.updated_template(@model),
      documents: documents,
      patched_documents: patched_documents
    }
  end

  private
  def patched_documents
    @records.map do |record|
     {
       record.identifier => JsonUpdate.updated_document(record,@model) 
     }
    end.reduce(:merge)
  end

  def documents
    @records.map do |record|
      { 
        record.identifier => JsonUpdate.default_document(record,model) 
      }
    end.reduce(:merge)
  end
end
