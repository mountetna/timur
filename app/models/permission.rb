class Permission < ActiveRecord::Base
  belongs_to :whitelist
end
