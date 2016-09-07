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

  get 'browse/:model/:name' => 'browse#model', as: :browse_model, constraints: { name: /[^\/]+/ }
  post 'json/records' => 'search#records_json', as: :records_json
  post 'json/view' => 'browse#view_json', as: :view_json
  post 'browse/update' => 'browse#update', as: :update_model

  get 'plot' => 'plot#index', as: :plot
  get 'json/plot_types' => 'plot#plot_types_json', as: :plot_types_json
  post 'json/plot' => 'plot#plot_json', as: :plot_json
  post 'json/pythia' => 'plot#pythia_json', as: :pythia_json
  post 'update_saves' => 'plot#update_saves', as: :update_saves

  get 'search' => 'search#index', as: :search
  get 'search/templates' => 'search#templates_json', as: :templates_json
  get 'search/identifiers' => 'search#identifiers_json', as: :identifiers_json
  post 'search/table' => 'search#table_json', as: :table_json
  post 'search/tsv' => 'search#table_tsv', as: :table_tsv
end
