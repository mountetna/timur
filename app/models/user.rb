class User < ActiveRecord::Base
  has_one :whitelist, class_name: 'Whitelist', foreign_key: :email, primary_key: :email
  has_many :saved_items
  has_many :manifests

  def can_read?(project_name)
    whitelist && whitelist.can_read?(project_name)
  end

  def can_edit?(project_name)
    whitelist && whitelist.can_edit?(project_name)
  end

  def is_admin?(project_name)
    whitelist && whitelist.is_admin?(project_name)
  end
end
