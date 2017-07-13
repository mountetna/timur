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
  get 'browse/:project_name' => 'browse#index', as: :browse
  get 'activity/:project_name' => 'browse#activity', as: :activity
  get 'browse/:project_name/:model/*name' => 'browse#model', as: :browse_model, format: false
  get 'map/:project_name' => 'browse#map', as: :map
  post 'browse/update' => 'browse#update', as: :update_model
  post 'json/view' => 'browse#view_json', as: :view_json

  post 'json/records' => 'search#records_json', as: :records_json
  post 'json/query' => 'search#query_json', as: :query_json
  get 'search' => 'search#index', as: :search
  post 'search/table' => 'search#table_json', as: :table_json
  post 'search/tsv' => 'search#table_tsv', as: :table_tsv

  resources :manifests, only: [:index, :create, :update, :destroy]
end
