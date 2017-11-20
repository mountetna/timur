# This task extracts the manifest from the old view files and places them into
# Timur DB manifest table. They can then be referenced by id in the
# view_attribute table.

namespace :timur do
  desc 'Move the manifest out of the old view files and into their database table.'
  task :load_view_manifests=> [:environment] do |t, args|

    # Collect the old view classes.
    views = [ProjectView]

    # Loop the view old models and extract the manifests.
    views.each do |view|

      # Pull the tabs out of the view.
      view.tabs.each_with_index do |tab, tab_index|

        tab_name = tab[0]
        tab_block = tab[1]
        tab = TimurView::Tab.new(tab_name, &tab_block)

        # Pull the panes out of the tabs.
        tab.panes.each_with_index do |pane, pane_index|

          # Pull the attributes of the panes.
          pane_name = pane[0]
          pane_block = pane[1]

          pane_block.display.each_with_index do |display, display_index|
            if display.attribute.key?(:plot)

              elem = Hash[
                :elements,
                display.attribute[:plot][:manifest].map do |manifest|
                  {
                    name: manifest[0],
                    script: manifest[1],
                    description: ''
                  }
                end
              ]

              mani = Manifest.create(
                user_id: 51,
                name: display.attribute[:plot][:name],
                description: '',
                project: 'ipi',
                access: 'public',
                data: elem
              )
            end
          end
        end
      end
    end
  end
end
