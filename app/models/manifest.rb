class Manifest < ActiveRecord::Base
  belongs_to :user
  after_initialize :set_defaults

  def is_public?
    access == "public"
  end

  def set_defaults
    if self.new_record?
      self.access ||= "private"
    end
  end

end
