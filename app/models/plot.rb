class Plot < ActiveRecord::Base
  belongs_to :manifest
  validates :name, presence: true
  validates :plot_type, presence: true
  validates :configuration, presence: true
end
