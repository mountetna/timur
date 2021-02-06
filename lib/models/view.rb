class View < Sequel::Model
  def self.id
    :model_name
  end

  def self.fetch_params(params)
    {
      project_name: params[:project_name]
    }
  end

  def self.edit_params(params)
    params.slice(:project_name, :model_name, :document)
  end

  def is_editable?(user)
    user.is_admin?(project_name)
  end

  def to_hash
    {
      project_name: project_name,
      model_name: model_name,
      id: id,
      document: document
    }
  end
end
