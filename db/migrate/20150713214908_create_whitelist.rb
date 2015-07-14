class CreateWhitelist < ActiveRecord::Migration
  def change
    create_table :whitelists do |t|
      t.string :email
      t.string :access

      t.timestamps null: false
    end
    add_index :whitelists, :email, unique: true
  end
end
