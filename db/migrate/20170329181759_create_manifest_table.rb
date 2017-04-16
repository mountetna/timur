class CreateManifestTable < ActiveRecord::Migration
  def change
    create_table :manifests do |t|
      t.belongs_to :user, index: true, null: false
      t.string :name, null: false
      t.string :description
      t.string :project, null: false
      t.string :access, null: false, index: true
      t.json :data, null: false
      t.timestamps null: false
    end

    add_foreign_key :manifests, :users
  end

end
