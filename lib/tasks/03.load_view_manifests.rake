namespace :timur do

  desc 'Loads the cached Timur view manifests into the new DB view schema.'
  task :load_view_manifests, [:user_id] => [:environment] do |t, args|

    # Here we make sure that we have a valid administration user to associate
    # view manifests with.
    user = User.find(args[:user_id])

    next unless user.whitelist.permissions.find do |permission| 
      permission[:project_name] == 'Administration' &&
      permission[:role] == 'administrator'
    end


    # Load each of the manifest json files in turn.
    Dir.glob('./lib/assets/manifest*.json') do |json_file_name|
      manifest_json = JSON.parse(File.read(json_file_name))

      manifest_hash = {
        user_id: user.id,
        name: manifest_json['name'],
        description: manifest_json['description'],
        project: manifest_json['project'],
        access: manifest_json['access'],
        data: manifest_json['data']
      }

      # Save the manifest hash to the DB.
      manifest = Manifest.create(manifest_hash)

      # Select the attribute associated with the manifest
      tab = ViewTab.where(
        name: manifest_json['tab'],
        project: manifest_json['project'],
        model: manifest_json['model']
      ).first

      pane = tab.view_panes.where(
        name: manifest_json['pane']
      ).first

      # If an accompanying plot file exists then we can add it to the DB.
      if File.exists?(json_file_name.sub!('manifest', 'plot').sub!('assets', 'assets/plots'))
        # Create the plot object in the DB.
        plot_data = JSON.parse(File.read(json_file_name))
        plot_data['manifest_id'] = manifest.id
        plot_data['name'] = json_file_name.sub('./lib/assets/plots/plot-ipi-', '').sub('.json', '')
        plot_data['user_id'] = user.id
        plot = Plot.create(plot_data)

        # Add the associated plot data to the attribute.
        attribute = pane.view_attributes.where(
          name: manifest_json['attribute']
        ).first

        # Make the manifest to attribute association.
        attribute.update(plot_id: plot.id)
      end
    end
  end
end
