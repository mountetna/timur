require 'yaml'
#require 'logger'

Magma.instance.configure YAML.load(File.read("config/magma.yml"))

Magma.instance.db.extension :connection_validator
Magma.instance.db.pool.connection_validation_timeout = -1
Magma.instance.db.loggers << Rails.logger
