require 'yaml'
#require 'logger'

magma = Magma.instance

magma.configure YAML.load(File.read("config/magma.yml"))
