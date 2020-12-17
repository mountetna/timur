require 'json'

def attribute_type(att)
  case att[:attribute_class]
  when nil
    'magma'
  when 'MarkdownAttribute'
    'markdown'
  else
    'plot'
  end
end

def attribute_options(att)
  case attribute_type(att)
  when 'magma', 'markdown'
    { attribute_name: att[:name] }
  when 'plot'
    { plot_id: att[:plot_id] }
  else
    {}
  end
end

Sequel.migration do
  up do
    create_table(:views) do
      primary_key :id
      String :model_name, null: false
      String :project_name, null: false
      json :document, null: false
      DateTime :created_at, null: false
      DateTime :updated_at, null: false

      index [:model_name, :project_name], name: :index_views_on_project_and_model_name, unique: true
    end


    db = Timur.instance.db

    panes = db[:view_panes].all
    attributes = db[:view_attributes].all

    views = db[:view_tabs].all.group_by do |tab| [ tab[:project], tab[:model] ]; end.map do |(project,model),tabs|
      {
        created_at: tabs.first[:created_at],
        updated_at: tabs.first[:updated_at],
        model_name: model,
        project_name: project,
        document: {
          tabs: tabs.sort_by{|t| t[:index_order]}.map do |tab|
            {
              name: tab[:name],
              title: tab[:title],
              description: tab[:description],
              panes: panes.select{|p| p[:view_tab_id] == tab[:id]}.sort_by{|p| p[:index_order]}.map do |pane|
                {
                  name: pane[:name],
                  title: pane[:title],
                  items: attributes.select{|a| a[:view_pane_id] == pane[:id]}.sort_by{|a| a[:index_order]}.map do |att|
                    {
                      name: att[:name],
                      title: att[:title],

                      type: attribute_type(att)
                    }.merge(attribute_options(att))
                  end
                }
              end
            }
          end
        }.to_json
      }
    end

    db[:views].multi_insert(views)
  end

  down do
    drop_table(:views)
  end
end
