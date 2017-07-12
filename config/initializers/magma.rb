require 'yaml'
Magma.instance.configure(YAML.load(File.read('config/magma.yml')))
