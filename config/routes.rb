Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  root 'welcome#index'

  get 'static/:path' => 'welcome#static', as: :static
  get 'login' => 'welcome#login', as: :login
  get 'noauth' => 'welcome#noauth', as: :noauth

  match 'auth/shibboleth/callback' => 'welcome#auth', via: [ :get, :post ], as: :auth
  get 'auth/shibboleth' => 'welcome#auth', as: :auth_shib

  # Routes for the main views - just browse for now
  
  get 'browse' => 'browse#index', as: :browse
  get 'activity' => 'browse#activity', as: :activity

  get 'browse/:model/*name' => 'browse#model', as: :browse_model, format: false
  post 'browse/update' => 'browse#update', as: :update_model

  post 'json/records' => 'search#records_json', as: :records_json
  post 'json/query' => 'search#query_json', as: :query_json
  post 'json/view' => 'browse#view_json', as: :view_json

  post 'json/pythia' => 'plot#pythia_json', as: :pythia_json

  get 'search' => 'search#index', as: :search
  post 'search/table' => 'search#table_json', as: :table_json
  post 'search/tsv' => 'search#table_tsv', as: :table_tsv

  resources :manifests, only: [:index, :create, :update, :destroy]
end
