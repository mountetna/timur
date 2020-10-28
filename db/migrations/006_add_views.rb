Sequel.migration do
  change do
    create_table(:views) do
      primary_key :id
      String :model_name, null: false
      String :project_name, null: false
      json :configuration, null: false
      DateTime :created_at, null: false
      DateTime :updated_at, null: false

      index [:manifest_id], name: :index_plots_on_manifest_id, unique: true
    end

    # create the new view JSON from the old view tabs
    tabs.map do |tab|
      panes = 

      {
        name: tab[:name]
        title: tab[:title]
        description: tab[:description]
        panes: panes.map do |pane|
          {
            name: pane[:name]
            title: pane[:title]
            description: pane[:description]
            items: attributes.map do |attribute|

              {
                type: 'magma_attribute',
                attribute_name: attribute[:name]
              }
            end
          }
        end
      }
    end
  end
end
