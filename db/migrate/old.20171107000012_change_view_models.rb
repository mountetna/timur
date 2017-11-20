class ChangeViewModels < ActiveRecord::Migration
  def change

    drop_table :view_attributes
    drop_table :view_panes

    create_table :view_tabs do |t|
      t.string :name
      t.string :title
      t.string :description
      t.string :project
      t.string :model
      t.integer :index_order
      t.timestamps
    end
    change_column_null :view_tabs, :name, false
    change_column_null :view_tabs, :project, false
    change_column_null :view_tabs, :model, false
    change_column_null :view_tabs, :index_order, false

    create_table :view_panes do |t|
      t.integer :view_tab_id
      t.string :name
      t.string :title
      t.string :description
      t.integer :index_order
      t.timestamps
    end
    add_foreign_key :view_panes, :view_tabs
    change_column_null :view_panes, :name, false
    change_column_null :view_panes, :view_tab_id, false
    change_column_null :view_panes, :index_order, false

    create_table :view_attributes do |t|
      t.integer :view_pane_id
      t.integer :manifest_id
      t.string :name
      t.string :title
      t.string :description
      t.string :attribute_class
      t.integer :index_order
      t.timestamps
    end
    add_foreign_key :view_attributes, :view_panes
    add_foreign_key :view_attributes, :manifests
    change_column_null :view_attributes, :name, false
    change_column_null :view_attributes, :view_pane_id, false
    change_column_null :view_attributes, :index_order, false
  end
end