Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  root 'welcome#index'

  get 'static/:path'=> 'welcome#static', as: :static
  get 'login'=> 'welcome#login', as: :login
  get 'noauth'=> 'welcome#noauth', as: :noauth
  get 'auth'=> 'welcome#auth', as: :auth
  get 'auth_fail'=> 'welcome#auth_failure', as: :auth_failure
  get 'auth_err'=> 'welcome#auth_error', as: :auth_error

  # Routes for the main views - just browse for now
  
  get 'browse' => 'browse#index', as: :browse
  get 'activity' => 'browse#activity', as: :activity

  get 'browse/:model/*name' => 'browse#model', as: :browse_model, format: false
  post 'browse/update' => 'browse#update', as: :update_model

  post 'json/records' => 'search#records_json', as: :records_json
  post 'json/query' => 'search#query_json', as: :query_json
  post 'json/view' => 'browse#view_json', as: :view_json

  get 'search' => 'search#index', as: :search
  post 'search/table' => 'search#table_json', as: :table_json
  post 'search/tsv' => 'search#table_tsv', as: :table_tsv

  get 'map' => 'browse#map', as: :map

  resources :manifests, only: [:index, :create, :update, :destroy]
end
