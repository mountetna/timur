# This task takes the existing view classes (built for the IPI project) and
# turns them into records in the view_panes and view_attributes tables.

namespace :timur do
  desc 'Tranform the IPI view models into database records.'
  task :transform_ipi_views=> [:environment] do |t, args|

    # Collect the old view classes.
    views = [ProjectView]

    # Loop the view models and build the database records.
    views.each do |view|

      # Get the Magma model/view name. The Timur views are prepended with the 
      # name of a Magma model, since the browser views are coupled with Magma
      # data.
      model_name = view.name.sub(/View/, '').underscore

      # BUILD THE TABS.
      view.tabs.each_with_index do |tab, tab_index|

        tab_name = tab[0]
        tab_block = tab[1]

        tab = TimurView::Tab.new(tab_name, &tab_block)

        view_tab = ViewTab.create(
          name: tab_name,
          title: tab_name,
          description: '',
          project: 'ipi',
          model: model_name,
          index_order: tab_index
        )

        # BUILD THE PANES.
        tab.panes.each_with_index do |pane, pane_index|

          pane_name = pane[0]
          pane_block = pane[1]

          view_pane = ViewPane.create(
            name: pane_name,
            title: pane.instance_variable_get('@title'),
            description: '',
            view_tab_id: view_tab[:id],
            index_order: pane_index
          )

          # BUILD THE ATTRIBUTES.
          pane_block.display.each_with_index do |display, display_index|

            att = display.attribute
            att_class = att.include?(:attribute_class) ? att[:attribute_class] : nil

            view_att = ViewAttribute.create(
              name: att[:name],
              title: att[:display_name],
              description: '',
              attribute_class: att_class,
              view_pane_id: view_pane[:id],
              index_order: display_index
            )
          end
        end
      end
    end
  end
end