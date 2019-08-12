Sequel.migration do
  change do
    alter_table(:plots) do
      add_column :description, String
    end
  end
end
