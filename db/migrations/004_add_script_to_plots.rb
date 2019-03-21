Sequel.migration do
  up do
    alter_table(:plots) do
      add_column :script, String, null: false, default: ''
    end

    self[:plots].all do |plot|
      manifest = self[:manifests].where(id: plot[:manifest_id]).first
      next unless manifest
      self[:plots].where(id: plot[:id]).update(
        script: manifest[:script]
      )
    end

    alter_table(:plots) do
      drop_column :manifest_id
    end
  end

  down do
    alter_table(:plots) do
      drop_column :script
      add_column :manifest_id, Integer, null: false
    end
  end
end
