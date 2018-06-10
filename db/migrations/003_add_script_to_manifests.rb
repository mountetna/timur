Sequel.migration do
  change do
    alter_table(:manifests) do
      add_column :script, String, null: false, default: ''
    end

    self[:manifests].all do |manifest|
      self[:manifests].where(id: manifest[:id]).update(
        script: manifest[:data]["elements"].map{|e| "@#{e['name']} = #{e['script']}"}.join("\n")
      )
    end

    alter_table(:manifests) do
      drop_column :data
    end
  end
end
