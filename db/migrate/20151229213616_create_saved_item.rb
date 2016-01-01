class CreateSavedItem < ActiveRecord::Migration
  def change
    create_table :saved_items do |t|
      t.string :key
      t.string :item_type
      t.integer :user_id
      t.json :contents
    end
    add_index :saved_items, :key, unique: true
    add_index :saved_items, :user_id
  end
end
