class User < ActiveRecord::Base
  has_one :whitelist, class_name: "Whitelist", foreign_key: :email, primary_key: :email
  def can_read?
    whitelist && whitelist.can_read?
  end
  def can_edit?
    whitelist && whitelist.can_edit?
  end
end
