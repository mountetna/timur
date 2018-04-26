Sequel::Model.plugin :timestamps, update_on_create: true

require_relative 'models/view_tab'
require_relative 'models/view_pane'
require_relative 'models/view_attribute'
require_relative 'models/manifest'
require_relative 'models/plot'
require_relative 'models/user'
