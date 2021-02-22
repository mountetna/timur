class Plot < Sequel::Model
  plugin :validation_helpers
  many_to_one :user
  many_to_one :manifest

  def self.fetch_params(params)
    (
      Sequel[user: params[:user]] |
      Sequel[access: [ 'public', 'view' ]]
    ) &
    Sequel[project_name: params[:project_name]]
  end

  def self.edit_params(params)
    edit_params = params.slice(
      :project_name, :name, :script, :plot_type,
      :configuration, :description, :user
    )
    if params[:access] && params[:user].is_admin?(params[:project_name])
      edit_params[:access] = params[:access]
    end
    edit_params
  end

  def validate
    super
    validates_presence :name
    validates_presence :plot_type
    validates_presence :configuration
    validates_presence :script
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

  EDITABLE_ATTRIBUTES = [
    :script, :access, :name, :plot_type,
    :description, :configuration, :access
  ]

  def update_allowed(params)
    plot_params = EDITABLE_ATTRIBUTES.map do |att|
      params.has_key?(att) ? [ att, params[att] ] : nil
    end.compact.to_h

    update(plot_params)
  end


  def to_hash
    [ :id, :name, :access, :description, :configuration, :created_at,
      :plot_type, :project_name, :script ].map do |key|
      [ key, self[key] ]
    end.to_h.merge(
      updated_at: self.updated_at.iso8601,
      user: user.name
    )
  end
end
