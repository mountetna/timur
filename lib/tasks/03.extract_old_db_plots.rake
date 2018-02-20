# This task extracts the plots out of the database before the migration.
require 'json'

namespace :timur do
  desc 'Extract the old plots from the Timur database.'
  task :extract_old_db_plots  => [:environment] do |t, args|
    Plot.all.each do |plot|
      manifest = Manifest.where(id: plot.manifest_id).first
      plot = JSON.parse(plot.to_json).reject {|key| key == 'id'}

      # Add the new fields that will be required after the migration.
      plot['user_id'] = manifest.user_id
      plot['project'] = manifest.project
      plot['access'] = manifest.access
      
      generate_plot_json(plot)
    end
  end
end

def generate_plot_json(plot)
  begin
    plot_key ="./lib/assets/plot-#{plot['project']}-manifest-"\
"#{plot['manifest_id']}.json"

    file = File.open(plot_key, 'w')
    file.write(JSON.pretty_generate(plot))
  ensure
    file.close
  end
end
