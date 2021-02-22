Sequel.migration do
  change do
    alter_table(:manifests) do
      rename_column :project, :project_name
    end

    alter_table(:plots) do
      rename_column :project, :project_name
    end
  end
end
