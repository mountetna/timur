Sequel.migration do
  up do
    create_table(:views) do
      primary_key :id
      String :model_name, null: false
      String :project_name, null: false
      json :document, null: false
      DateTime :created_at, null: false
      DateTime :updated_at, null: false

      index [:manifest_id], name: :index_plots_on_manifest_id, unique: true
    end
    # create the new view JSON from the old view tabs
    require 'pry'
    binding.pry
  end

  down do
    drop_table(:views)
  end
end
