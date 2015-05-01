require 'yaml'

Magma.instance.connect YAML.load(File.read("config/magma.yml"))
Magma.instance.load_models
