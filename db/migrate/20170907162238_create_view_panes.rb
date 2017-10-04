class CreateViewPanes < ActiveRecord::Migration
  def change
    create_table :view_panes do |t|
      t.string :tab_name
      t.string :name
      t.string :title
      t.string :description

      t.timestamps null: false
    end
  end
end
