class CreatePermissions < ActiveRecord::Migration
  def change
    create_table :permissions do |t|
      t.belongs_to :whitelist, index: true
      t.string :role
      t.string :project_name
      t.timestamps null: false
    end
  end
end
