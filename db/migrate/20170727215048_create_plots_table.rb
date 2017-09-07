class CreatePlotsTable < ActiveRecord::Migration
  def change
    create_table :plots do |t|
      t.belongs_to :manifest, index: true, null: false
      t.string :name, null: false
      t.string :plot_type, null: false
      t.json :configuration, null: false
      t.timestamps null: false
    end
  end
end
