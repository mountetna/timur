class ModifyUser < ActiveRecord::Migration
  def change
    remove_column :users, :ucsf_id, :string
  end
end
