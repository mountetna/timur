Sequel.migration do
  change do
    create_table(:plots, :ignore_index_errors=>true) do
      primary_key :id
      Integer :manifest_id, :null=>false
      String :name, :null=>false
      String :plot_type, :null=>false
      json :configuration, :null=>false
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      Integer :user_id
      String :access
      String :project

      index [:manifest_id], :name=>:index_plots_on_manifest_id
    end

    create_table(:schema_migrations, :ignore_index_errors=>true) do
      String :version, :null=>false

      index [:version], :name=>:unique_schema_migrations, :unique=>true
    end

    create_table(:users, :ignore_index_errors=>true) do
      primary_key :id
      String :name
      String :email
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      String :saves

      index [:email], :name=>:index_users_on_email, :unique=>true
    end

    create_table(:view_tabs) do
      primary_key :id
      String :name, :null=>false
      String :title
      String :description
      String :project, :null=>false
      String :model, :null=>false
      Integer :index_order, :null=>false
      DateTime :created_at
      DateTime :updated_at
    end

    create_table(:manifests, :ignore_index_errors=>true) do
      primary_key :id
      foreign_key :user_id, :users, :null=>false, :key=>[:id]
      String :name, :null=>false
      String :description
      String :project, :null=>false
      String :access, :null=>false
      String :data, :null=>false
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false

      index [:access], :name=>:index_manifests_on_access
      index [:user_id], :name=>:index_manifests_on_user_id
    end

    create_table(:view_attributes, :ignore_index_errors=>true) do
      primary_key :id
      String :name
      String :attribute_class
      Integer :view_pane_id
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      foreign_key :plot_id, :plots, :key=>[:id]
      Integer :manifest_id
      Integer :index_order
      String :title

      index [:plot_id], :name=>:index_view_attributes_on_plot_id
      index [:view_pane_id], :name=>:index_view_attributes_on_view_pane_id
    end

    create_table(:view_panes, :ignore_index_errors=>true) do
      primary_key :id
      String :name
      String :title
      String :description
      DateTime :created_at, :null=>false
      DateTime :updated_at, :null=>false
      foreign_key :view_tab_id, :view_tabs, :key=>[:id]
      Integer :index_order

      index [:view_tab_id], :name=>:index_view_panes_on_view_tab_id
    end
  end
end
