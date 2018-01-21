class ChangeViewModels < ActiveRecord::Migration
  def change

    drop_table :view_attributes
    drop_table :view_panes
    drop_table :plots

    create_table :plots do |t|
      t.belongs_to :manifest, index: true, null: false
      t.belongs_to :user, index: true, null: false
      t.string :name, null: false
      t.string :plot_type, null: false
      t.string :access, null: false
      t.string :project, null: false
      t.json :configuration, null: false
      t.timestamps null: false
    end

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
      t.integer :plot_id
      t.string :name
      t.string :title
      t.string :description
      t.string :attribute_class
      t.integer :index_order
      t.timestamps
    end
    add_foreign_key :view_attributes, :view_panes
    add_foreign_key :view_attributes, :plots
    change_column_null :view_attributes, :name, false
    change_column_null :view_attributes, :view_pane_id, false
    change_column_null :view_attributes, :index_order, false
  end
end
