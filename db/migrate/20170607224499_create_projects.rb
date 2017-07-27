class CreateProjects < ActiveRecord::Migration
  def change
    create_table :projects do |t|
      t.string :project_name, null: false 
      t.string :project_name_full
      t.string :group_name
    end

    execute <<-SQL
      alter table projects
        add constraint unique_project_name unique (project_name);
    SQL
  end
end
