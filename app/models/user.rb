class User < ActiveRecord::Base
  has_one :whitelist, class_name: "Whitelist", foreign_key: :email, primary_key: :email
  has_many :saved_items

  def can_read?
    whitelist && whitelist.can_read?
  end
  def can_edit?
    whitelist && whitelist.can_edit?
  end

  def get_save key
    saved_items.where(key: key).first.to_item
  end
end
