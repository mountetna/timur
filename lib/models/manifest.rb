class Manifest < Sequel::Model
  plugin :validation_helpers
  many_to_one :user
  one_to_many :plots

  def self.fetch_params(params)
    (
      Sequel[user: params[:user]] |
      Sequel[access: [ 'public', 'view' ]]
    ) &
    Sequel[project_name: params[:project_name]]
  end

  def self.edit_params(params)
    edit_params = params.slice(:project_name, :name, :script, :description, :user)

    if params[:access] && params[:user].is_admin?(params[:project_name])
      edit_params[:access] = params[:access]
    end
    edit_params
  end

  def validate
    super
    validates_presence :name
    validates_presence :project_name
    validates_presence :script
    validates_includes [ 'public', 'private', 'view' ], :access
  end

  def before_validation
    self.access ||= 'private'
    super
  end

  def is_public?
    access == 'public'
  end

  def is_editable?(other_user)
    other_user == user || other_user.is_admin?(project_name)
  end

  def to_hash
    [:id, :name, :description, :project_name, :access, :script].map do |key|
      [ key, self[key] ]
    end.to_h.merge(
      updated_at: self.updated_at.iso8601,
      user: user.name,
      md5sum: Digest::MD5.hexdigest(script)
    )
  end
end
