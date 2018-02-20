require 'json'

namespace :timur do
  desc 'Loads the cached plots into the new DB schema.'
  task :load_plots => [:environment] do |t, args|
    Dir.glob('./lib/assets/plot-ipi-manifest-*.json') do |json_file_name|
      plot_json = JSON.parse(File.read(json_file_name))
      Plot.new(plot_json).save
    end
  end
end
