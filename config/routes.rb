Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  root 'welcome#index'

  # welcome_controller.rb
  get 'static/:path'=> 'welcome#static', as: :static
  get 'login'=> 'welcome#login', as: :login
  get 'auth'=> 'welcome#auth', as: :auth
  get 'no_auth'=> 'welcome#no_auth', as: :no_auth
  get 'auth_error'=> 'welcome#auth_error', as: :auth_error

  # browse_controller.rb
  get ':project_name'=> 'browse#index', as: :project
  get ':project_name/browse'=> 'browse#index', as: :browse
  get ':project_name/activity'=> 'browse#activity', as: :activity
  get ':project_name/browse/:model_name/*record_name'=> 'browse#model', as: :browse_model, format: false
  get ':project_name/map'=> 'browse#map', as: :map
  post ':project_name/update'=> 'browse#update', as: :update_model
  post ':project_name/view'=> 'browse#view_json', as: :view_json

  # search_controller.rb
  get ':project_name/search'=> 'search#index', as: :search
  post ':project_name/json/records'=> 'search#records_json', as: :records_json
  post ':project_name/json/consignment'=> 'search#consignment_json', as: :consignment_json
  post ':project_name/json/consignment_by_manifest_id_json'=> 'search#consignment_by_manifest_id_json', as: :consignment_by_manifest_id_json
  post ':project_name/json/question'=> 'search#question_json', as: :question_json
  post ':project_name/search/tsv'=> 'search#table_tsv', as: :table_tsv

  # plot_controller.rb
  get ':project_name/plots'=> 'plots#index', as: :plots
  post ':project_name/plots/fetch'=> 'plots#fetch', as: :plots_fetch
  post ':project_name/plots/create'=> 'plots#create', as: :manifests_plots_create
  put ':project_name/plots/update/:id'=> 'plots#update', as: :manifests_plots_update
  delete ':project_name/plots/destroy/:id'=> 'plots#destroy', as: :manifests_plots_destroy

  # manifest_controller.rb
  get ':project_name/manifests'=> 'manifests#index', as: :manifests
  post ':project_name/manifests/fetch'=> 'manifests#fetch', as: :manifests_fetch
  post ':project_name/manifests/create'=> 'manifests#create', as: :manifests_create
  post ':project_name/manifests/update/:id'=> 'manifests#update', as: :manifests_update
  post ':project_name/manifests/destroy/:id'=> 'manifests#destroy', as: :manifests_destroy
end
