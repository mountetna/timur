# See ./lib/tasks/migrate_ivew.rake for more information related to this
# migration.
class ChangeViewModels < ActiveRecord::Migration
  def change

# First let's add all the tables columns we need.
    # Create the top level view tabs.
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

    # Add required columns to view panes.
    add_column :view_panes, :view_tab_id, :integer
    add_column :view_panes, :index_order, :integer

    # Add required columns to view attributes.
    add_column :view_attributes, :plot_id, :integer
    add_column :view_attributes, :manifest_id, :integer
    add_column :view_attributes, :index_order, :integer

    # Add required columns to plots.
    add_column :plots, :user_id, :integer
    add_column :plots, :access, :string
    add_column :plots, :project, :string

# Run the script to modify data in the DB.
    Rake::Task['timur:migrate_views'].invoke

# Remove all the old columns.
    remove_column :view_panes, :tab_name
    remove_column :view_panes, :view_model_name
    remove_column :view_panes, :project_name

    remove_column :view_attributes, :display_name
    remove_column :view_attributes, :plot
    remove_column :view_attributes, :placeholder

    add_foreign_key :view_panes, :view_tabs
    add_index :view_panes, :view_tab_id
    add_foreign_key :view_attributes, :plots
    add_index :view_attributes, :plot_id
  end
end