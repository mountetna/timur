class AddSavesToUser < ActiveRecord::Migration
  def change
    add_column :users, :saves, :json
  end
end
