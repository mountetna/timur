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
  get ':project_name'=> 'browse#index', as: :browse
  get ':project_name/activity'=> 'browse#activity', as: :activity
  get ':project_name/browse/:model/*name'=> 'browse#model', as: :browse_model, format: false
  get ':project_name/map'=> 'browse#map', as: :map
  post ':project_name/update'=> 'browse#update', as: :update_model
  post ':project_name/view'=> 'browse#view_json', as: :view_json

  # search_controller.rb
  get ':project_name/search'=> 'search#index', as: :search
  post 'json/records'=> 'search#records_json', as: :records_json
  post 'json/query'=> 'search#query_json', as: :query_json
  post 'search/table'=> 'search#table_json', as: :table_json
  post 'search/tsv'=> 'search#table_tsv', as: :table_tsv

  # manifest_controller.rb
  get ':project_name/manifests'=> 'manifests#index', as: :manifests
  post 'manifests/fetch'=> 'manifests#fetch', as: :manifests_fetch
  post 'manifests/create'=> 'manifests#create', as: :manifests_create
  post 'manifests/update/:id'=> 'manifests#update', as: :manifests_update
  post 'manifests/destroy/:id'=> 'manifests#destroy', as: :manifests_destroy
end
