Sequel.migration do
  change do
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
end
