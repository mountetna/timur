class Whitelist < ActiveRecord::Base
  has_many :permissions, {dependent: :destroy}

  def can_read?(project_name)
    read = false
    perms = permissions.where({whitelist_id: id}).each do |perm|
      return true if perm.project_name == project_name
    end
    return read
  end

  def can_edit?(project_name)
    edit = false
    perms = permissions.where({whitelist_id: id}).each do |perm|
      if perm.project_name == project_name
        return true if perm.role == 'administrator' || perm.role == 'editor'
      end
    end
    return edit
  end

  def is_admin?(project_name)
    admin = false
    perms = permissions.where({whitelist_id: id}).each do |perm|
      if perm.project_name == project_name
        return true if perm.role == 'administrator'
      end
    end
    return admin
  end

  # Whitelist record expire time is set at 5 minutes.
  def expired?
    (Time.now.utc - (5*60)) > updated_at ? true : false
  end

  # Link the permissions to the whitelist
  def associate_permissions(perms)
    perms.each do |perm|
      permissions.create({project_name:perm['project_name'], role:perm['role']})
    end
  end
end
