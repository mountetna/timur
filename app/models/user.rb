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
    if saves["series"].has_key? key
      return Series.new key,  saves["series"][key].symbolize_keys
    end
    if saves["mappings"].has_key? key
      return Mapping.new key,  saves["mappings"][key].symbolize_keys
    end
  end
end
