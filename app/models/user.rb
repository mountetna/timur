class User < ActiveRecord::Base
  has_one :whitelist, {class_name: 'Whitelist', foreign_key: :email, primary_key: :email}
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

  def get_save(key)
    if saves['series'].has_key?(key)
      return Series.new(key, saves['series'][key].symbolize_keys)
    end

    if DEFAULT_MAPPINGS.has_key?(key)
      return Mapping.new(key, DEFAULT_MAPPINGS[key])
    end

    if saves['mappings'].has_key?(key)
      return Mapping.new(key, saves['mappings'][key].symbolize_keys)
    end
  end
end
