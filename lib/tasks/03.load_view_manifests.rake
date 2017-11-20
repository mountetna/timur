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
    Dir.glob('./lib/assets/manifest*.json') do |json_file|
      manifest_json = JSON.parse(File.read(json_file))

      manifest_hash = {
        user_id: user.id,
        name: manifest_json['name'],
        description: manifest_json['description'],
        project: manifest_json['project'],
        access: 'public',
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

      attribute = pane.view_attributes.where(
        name: manifest_json['attribute']
      ).first

      # Make the manifest to attribute association.
      attribute.update(manifest_id: manifest.id)
    end
  end
end
