class Whitelist < ActiveRecord::Base
  has_many :permissions, dependent: :destroy
  has_one :user, foreign_key: :email, primary_key: :email

  # How long the whitelist entry is good for, in seconds
  EXPIRE_TIME=5*60

  # this method creates a whitelist entry
  # for a given token, by hook or by crook
  def self.for_token(token)
    # find all tokens for this user
    whitelist = self.where(token: token).first

    if whitelist && whitelist.expired?
      whitelist.destroy
      whitelist = nil 
    end

    if whitelist.nil?
      # Ask janus
      # if the retrieve fails, this will be nil
      janus_user = JanusUser.retrieve(token)

      whitelist = self.for_janus_user(janus_user) if janus_user
    end

    whitelist
  end

  def self.for_janus_user(janus_user)
    self.where(email: janus_user.email).first_or_create do |whitelist|
      whitelist.set_from_janus_user(janus_user)
    end
  end

  def set_from_janus_user(janus_user)
    # first set the main cheese
    update(janus_user.to_hash)

    # then make permissions
    janus_user.permissions.each do |perm|
      permissions.create(perm)
    end

    # then make the user
    if user.nil?
      create_user(
        name: "#{first_name} #{last_name}"
      )
    end
  end

  def can_read?(project_name)
    permissions.any? do |perm|
      perm.project_name == project_name
    end
  end

  def can_edit?(project_name)
    permissions.any? do |perm|
      perm.project_name == project_name && (perm.role == 'administrator' || perm.role == 'editor')
    end
  end

  def is_admin?(project_name)
    permissions.any? do |perm|
      perm.project_name == project_name && perm.role == 'administrator'
    end
  end

  # Whitelist record expire time is set at 5 minutes.
  def expired?
    (Time.now.utc - (5*60)) > updated_at ? true : false
  end

  # Link the permissions to the whitelist
end
