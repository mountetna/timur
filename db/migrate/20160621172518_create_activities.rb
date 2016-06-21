class CreateActivities < ActiveRecord::Migration
  def change
    create_table :activities do |t|
      t.integer :user_id
      t.string :magma_model
      t.string :identifier
      t.string :action

      t.timestamps null: false
    end
  end
end
