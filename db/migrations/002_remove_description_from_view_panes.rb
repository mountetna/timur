Sequel.migration do
  change do
    alter_table(:view_panes) do
      drop_column :description
    end
  end
end
