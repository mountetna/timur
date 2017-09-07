class RenameModelName < ActiveRecord::Migration
  def change
    rename_column :view_panes, :model_name, :view_model_name
  end
end
