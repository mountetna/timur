# This task takes the existing view classes (built for the IPI project) and
# turns them into records in the view_panes and view_attributes tables.

namespace :timur do
  desc "Create view models from view classes"
  task :make_view_model => [:environment] do |t,args|
    views = [ SampleView, ProjectView, RnaSeqPlateView, PatientView, ExperimentView ]
    views.each do |view|
      model_name = view.name.sub(/View/,'').snake_case
      view.tabs.each do |tab_name,tab_block|
        tab = TimurView::Tab.new(tab_name, &tab_block)
        tab.panes.each do |pane_name, pane|
          view_pane = ViewPane.create(
            view_model_name: model_name,
            project_name: "ipi",
            tab_name: tab_name,
            name: pane_name,
            title: pane.instance_variable_get("@title")
          )
          pane.display.each do |display|
            att = display.attribute
            view_att = ViewAttribute.create(
              name: att[:name],
              attribute_class: att[:attribute_class],
              display_name: att[:display_name],
              plot: att[:plot].to_json,
              placeholder: att[:placeholder],
              view_pane: view_pane
            )
          end
        end
      end
    end
  end
end
