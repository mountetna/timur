class View < Sequel::Model
  def to_hash
    {
      project_name: project_name,
      model_name: model_name,
      document: document
    }
  end
end
