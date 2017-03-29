class CreateManifestTable < ActiveRecord::Migration
  def change
    create_table :manifests do |t|
      t.integer :user_id
      t.string :name, null: false
      t.string :description, null: false
      t.string :project, null: false
      t.string :access, null: false, index: true
      t.json :data, null: false
    end

    add_foreign_key :manifests, :users, index: true
  end
end
