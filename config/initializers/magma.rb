require 'yaml'
#require 'logger'

magma = Magma.instance

magma.configure YAML.load(File.read("config/magma.yml"))

magma.load_models

magma.db.extension :connection_validator
magma.db.pool.connection_validation_timeout = -1
magma.db.loggers << Rails.logger
