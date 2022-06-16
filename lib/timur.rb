require_relative 'commands'

class Timur
  include Etna::Application
  attr_reader :db

  def setup_db(load_models = true)
    @db = Sequel.connect(config(:db))
    @db.extension :connection_validator
    @db.extension :pg_json
    @db.pool.connection_validation_timeout = -1

    require_relative 'models' if load_models
  end
end
