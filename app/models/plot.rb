class Plot < ActiveRecord::Base
  belongs_to :manifest
  after_initialize :set_defaults
  validates :name, presence: true
  validates :type, presence: true
  validates :configuration, presence: true
end
