require 'csv'
require 'pry'

namespace :timur do

  desc 'Loads the cached Timur view data into the new DB view schema.'
  task :load_new_db_views => [:environment] do |t, args|

    csv_opts = {:headers=> true, :header_converters=> :symbol}

    tab_array = []
    CSV.foreach('./lib/assets/view_tabs.csv', csv_opts) do |tab|
      tab_array.push({
        name: tab[:name],
        title: tab[:title],
        description: tab[:description],
        project: tab[:project],
        model: tab[:model],
        index_order: tab[:index_order]
      })
    end

    tabs = ViewTab.create(tab_array)

    pane_array = []
    CSV.foreach('./lib/assets/view_panes.csv', csv_opts) do |pane|

      # Get the view_tab id for the pane association.
      tab = ViewTab.where(
        project: pane[:project],
        model: pane[:model],
        name: pane[:tab]
      ).first

      pane_array.push({
        view_tab_id: tab[:id],
        name: pane[:name],
        title: tab[:title],
        description: tab[:description],
        index_order: tab[:index_order]
      })
    end

    panes = ViewPane.create(pane_array)

    attribute_array = []
    CSV.foreach('./lib/assets/view_attributes.csv', csv_opts) do |attribute|
      # Get the view_tab id for the pane association.
      tab = ViewTab.where(
        project: attribute[:project],
        model: attribute[:model],
        name: attribute[:tab]
      ).first

      # Get the view_pane id for the attribute association.
      pane = tab.view_panes.where(name: attribute[:pane]).first

      attribute_array.push({
        view_pane_id: pane[:id],
        manifest_id: nil,
        name: attribute[:name],
        title: attribute[:title],
        description: attribute[:description],
        attribute_class: attribute[:attribute_class],
        index_order: attribute[:index_order]
      })
    end

    attributes = ViewAttribute.create(attribute_array)
  end
end
