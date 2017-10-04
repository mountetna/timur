class AddModelToViewPane < ActiveRecord::Migration
  def change
    add_column :view_panes, :model_name, :string
    add_column :view_panes, :project_name, :string
  end
end
