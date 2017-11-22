class Manifest < ActiveRecord::Base
  belongs_to :user
  has_many :plots, dependent: :destroy
  alias_attribute :project_name, :project
  after_initialize :set_defaults
  validates :name, presence: true
  validates :project, presence: true
  validates :data, presence: true
  validates :access, inclusion: {in: %w(public private), message: "%{value} is not a valid access"}

  def is_public?
    access == 'public'
  end

  def can_edit?(user, project_name)
    user.id == self.user_id || user.is_admin?(project_name)
  end

  def to_json(user, project_name)
    json = self.as_json(except: [:user_id], include: [{ user: { only: :name } }])
    json['is_editable'] =  can_edit?(user, project_name)

    # plots as an array
    json['plots'] = self.plots.map { |plot| plot.as_json(user, project_name) }

    json
  end

  def set_defaults
    if self.new_record?
      self.access ||= 'private'
    end
  end
end
