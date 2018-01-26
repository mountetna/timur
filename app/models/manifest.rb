require 'digest'

class Manifest < ActiveRecord::Base
  belongs_to :user
  has_many :plots, dependent: :destroy
  alias_attribute :project_name, :project
  after_initialize :set_defaults
  validates :name, presence: true
  validates :project, presence: true
  validates :data, presence: true

  validates :access, {
    inclusion: {
      in: %w(public private view),
      message: "%{value} is not a valid access"
    }
  }

  def is_public?
    access == 'public'
  end

  def can_edit?(user, project_name)
    user.id == self.user_id || user.is_admin?(project_name)
  end

  def to_json(user, project_name)

    # Add some basic ownership data to the manfiest.
    json = self.as_json({
      except: [
        :user_id
      ],
      include: [
        user: {
          only: [:id, :name, :email]
        }
      ]
    })

    # Check if the current user can edit this manifest.
    json['is_editable'] =  can_edit?(user, project_name)

    # These md5sums will be used for consignment and manifest cache checking. We
    # must make sure that the md5sums are NOT part of the hashes themselves.
    md5sum = Digest::MD5.hexdigest(json.to_json)
    md5sum_data = Digest::MD5.hexdigest(json['data'].to_json)

    # Add the hashes to the manifest.
    json['md5sum'] = md5sum
    json['md5sum_data'] = md5sum_data

    return json
  end

  def set_defaults
    if self.new_record? then self.access ||= 'private' end
  end
end
