class ModifyWhitelists < ActiveRecord::Migration
  def change
    add_column :whitelists, :token, :string
    add_column :whitelists, :first_name, :string
    add_column :whitelists, :last_name, :string
    remove_column :whitelists, :access
  end
end
