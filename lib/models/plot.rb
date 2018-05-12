class Plot < Sequel::Model
  plugin :validation_helpers
  many_to_one :user
  many_to_one :manifest

  def validate
    super
    validates_presence :name
    validates_presence :plot_type
    validates_presence :configuration
    validates_presence :manifest
  end

  def before_validation
    self.access ||= 'private'
    super
  end

  def is_public?
    access == 'public'
  end

  def is_editable?(other_user)
    other_user == user || other_user.is_admin?(project)
  end

  EDITABLE_ATTRIBUTES = [
    :manifest_id, :access, :name, :plot_type,
    :configuration, :access
  ]

  def update_allowed(params)
    plot_params = EDITABLE_ATTRIBUTES.map do |att|
      params.has_key?(att) ? [ att, params[att] ] : nil
    end.compact.to_h

    update(plot_params)
  end
end
