class Manifest < Sequel::Model
  plugin :validation_helpers
  many_to_one :user
  one_to_many :plots

  def validate
    super
    validates_presence :name
    validates_presence :project
    validates_presence :data
    validates_includes [ 'public', 'private' ], :access
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

  def to_json(other_user)
    [ :id, :name, :description, :project, :data ].map {|k| [k,self[k]] }.to_h.merge(
      user: user.name,
      is_editable: is_editable?(other_user)
    )
  end
end