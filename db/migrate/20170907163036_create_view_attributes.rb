class CreateViewAttributes < ActiveRecord::Migration
  def change
    create_table :view_attributes do |t|
      t.string :name
      t.string :attribute_class
      t.string :display_name
      t.json :plot
      t.string :placeholder
      t.integer :view_pane_id

      t.timestamps null: false
    end
    add_index('view_attributes', 'view_pane_id')
  end
end
