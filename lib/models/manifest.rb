class Manifest < Sequel::Model
  plugin :validation_helpers
  many_to_one :user
  one_to_many :plots

  def validate
    super
    validates_presence :name
    validates_presence :project
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
    other_user == user || other_user.is_admin?(project)
  end

  def to_hash(other_user)
    [:id, :name, :description, :project, :access, :script].map do |key|
      [ key, self[key] ]
    end.to_h.merge(
      updated_at: self.updated_at.iso8601,
      user: user.name,
      is_editable: is_editable?(other_user),
      md5sum: Digest::MD5.hexdigest(script)
    )
  end
end
