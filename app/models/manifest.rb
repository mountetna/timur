class Manifest < ActiveRecord::Base
  belongs_to :user
  after_initialize :set_defaults
  validates :name, presence: true
  validates :project, presence: true
  validates :data, presence: true
  validates :access, inclusion: { in: %w(public private),
  message: "%{value} is not a valid access" }

  def is_public?
    access == "public"
  end

  def can_edit?(user)
    user.id == self.user_id || (self.is_public? && user.is_admin?)
  end

  def to_json(user)
    json = self.as_json(except: [:user_id], include: { user: { only: :name } })
    json[:is_editable] =  can_edit?(user)
    json
  end

  def set_defaults
    if self.new_record?
      self.access ||= "private"
    end
  end

end
