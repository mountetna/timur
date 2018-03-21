# As part of the new view structure we need to modify the data in the DB. This 
# task should be a one off script run as part of the migration. The data for
# plots used by the view are/were spread across the view models and in the plot
# components themselves. I've extracted the view plot data, from it's various
# sources, and placed them into files located at `./lib/assets/plots`.
#
# Not all attributes that need manifest/consignment data have plots. We need to
# associate them as well.
#
# The following are the list of steps required for the data migration to be
# complete:
#
# Steps in the migration.
# 01. Create view_tabs table.
# 02. Create columns view_tab_id and index_order in view_panes table.
# 03. Create columns plot_id and index_order in the view_attributes table.
# 04. Create columns user_id, access, plot_id project to plots table.
# 
# Steps found here in the rake task.
# 05. Loop view_panes table. Create view_tabs, insert view_tab_id on view_panes
#     table.
# 06. Loop view_attributes table and extract the plots on the view_attributes
#     table.
# 07. Extract the manifests from the plots from the view_attributes table.
# 08. Create manifest records from the plots in the view_attribtes table.
# 09. Create plot records in the plot table from the csv files.
# 10. Using the names from the plot csv records look up the associated
#     view_attribute ids and the manifest ids.
# 11. Reprocess the index orders for the tables view_tabs, view_attributes, and
#     view_panes.
#
# Final steps back in the migration.
# 12. Drop the columns tab_name, project_name, and view_model_name from the
#     view_panes table.
# 13. Drop the columns placeholder, display_name, and plot from the
#     view_attributes table.

namespace :timur do
  desc "This is to be used only by the migration "\
"\'20171107000013_change_view_models. See the rake file for more info.\'."
  task :migrate_views => [:environment] do |t, args|

    # Load all of the plot file data into an object for later use.
    plots = []
    Dir.glob('./lib/assets/plots/plot-*.json') do |json_file_name|
      begin
        plot_json = JSON.parse(File.read(json_file_name))
        plots.push(plot_json)
      rescue
        puts "Could not parse the file #{json_file_name}."
      end
    end

    # Loop view_panes table.
    old_panes = ViewPane.all
    old_panes.each do |pane|

      # Create view_tabs.
      tab_data = {
        name: pane[:tab_name],
        project: pane[:project_name],
        model: pane[:view_model_name],
      }

      tab = ViewTab.where(tab_data).first
      if tab.nil?
        tab_data[:index_order] = 0
        tab = ViewTab.create(tab_data)
      end

      # Insert view_tab_id on the view_pane.
      pane.view_tab_id = tab.id
      pane.save!
    end

    # Loop view_attributes table.
    old_attriubtes = ViewAttribute.all
    old_attriubtes.each do |view_attribute|
      next if view_attribute.plot.nil?

      # Pull the assocated view_tab and view_pane.
      view_pane = ViewPane.where({id: view_attribute.view_pane_id}).first
      view_tab = ViewTab.where({id: view_pane.view_tab_id}).first

      # Select the plot file that is associated with our attribute (if there
      # is one).
      view_plot = plots.find do |plot|
        plot['project'] == view_tab.project &&
        plot['view_name'] == view_tab.model &&
        plot['tab_name'] == view_tab.name &&
        plot['pane_name'] == view_pane.name &&
        plot['attribute_name'] == view_attribute.name
      end

      # Here the view_attribute should have manifest data attached to it's old
      # plot. We need to make sure we have a manifest before proceeding.
      next if !view_attribute.plot.key?('manifest')

      # Extract the manifests from the plots on the view_attributes table.
      elements = view_attribute.plot['manifest'].map do |elem|
        {'name'=> elem[0], 'description'=> '', 'script'=> elem[1]}
      end

      # Create manifest records from the plots in the view_attribtes table.
      manifest = Manifest.create({
        name: view_attribute.plot['name'],
        user: User.first,
        description: '',
        access: 'view',
        project: view_tab.project,
        data: {elements: elements}
      })

      if !view_plot.nil?

        # Add the name of the plot to the attribute.
        view_attribute.title = view_plot['title']

        # Associate the manifest id to the plot.
        view_plot['manifest_id'] = manifest.id
        view_plot['user_id'] = User.first.id

        # Remove the keys not required for the plot.
        ['title', 'view_name', 'tab_name', 'pane_name', 'attribute_name'].each do |key|
          view_plot.delete(key)
        end

        # Save the plot.
        view_plot = Plot.create(view_plot)

        # Associate the plot with it's attribute by id.
        view_attribute.plot_id = view_plot.id
      end

      # Add the manifest id to the attribute.
      view_attribute.manifest_id = manifest.id
      view_attribute.save!
    end

    # Reprocess the index_orders for the view_tabs table.
    view_tabs = {}
    ViewTab.all.each do |tab|
      # Create a key from the model the tab is supposed to render.
      view_tabs[tab.model] = [] if !view_tabs.key?(tab.model)
      view_tabs[tab.model].push(tab)
    end

    # Now that we have each tab sorted by model and placed into an array we can
    # reset it's index_order by the array index.
    view_tabs.each do |view_name, view_group|
      view_group.each_index do |index|
        view_group[index].index_order = index
        view_group[index].save!
      end
    end

    # Reprocess the index_order for the view_panes table.
    view_panes = {}
    ViewPane.all.each do |pane|
      # Create a key from the tab name a pane belongs to.
      view_panes[pane.view_tab_id] = [] if !view_panes.key?(pane.view_tab_id)
      view_panes[pane.view_tab_id].push(pane)
    end

    # Now that we have each pane sorted by tab name and placed into an array we
    # can now reset each pane's index order by the pane_group's index.
    view_panes.each do |tab_id, tab_group|
      tab_group.each_index do |index|
        tab_group[index].index_order = index
        tab_group[index].save!
      end
    end

    # Reprocess the index_order for the view_attributes table.
    view_attributes = {}
    ViewAttribute.all.each do |attribute|
      if !view_attributes.key?(attribute.view_pane_id)
        view_attributes[attribute.view_pane_id] = []
      end
      view_attributes[attribute.view_pane_id].push(attribute)
    end

    # Now that we have each attribute sorted by pane_id and placed into an array
    # we can reset each attribute's index order by the 
    view_attributes.each do |pane_id, pane_group|
      pane_group.each_index do |index|
        pane_group[index].index_order = index
        pane_group[index].save!
      end
    end
  end
end
