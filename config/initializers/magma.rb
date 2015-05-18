require 'yaml'

Magma.instance.configure YAML.load(File.read("config/magma.yml"))

class Magma::Document
  before :store, :report

  def report(file)
    Rails.logger.info "Called before store thingy with #{file}."
  end
end

class DcStain
  def before_save
    return false if super == false
    Rails.logger.info "Going to save."
  end
end
