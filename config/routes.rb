Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  root 'welcome#index'

  get 'static/:path' => 'welcome#static', as: :static

  get 'login' => 'welcome#login', as: :login
  match 'auth/shibboleth/callback' => 'welcome#auth', via: [ :get, :post ], as: :auth
  get 'auth/shibboleth' => 'welcome#auth', as: :auth_shib

  # Routes for the main views - just browse for now
  #
  get 'browse' => 'browse#index', as: :browse

  get 'browse/:model/:name' => 'browse#model', as: :browse_model, constraints: { name: /[^\/]+/ }
  get 'json/:model/:name' => 'browse#json', as: :browse_json, constraints: { name: /[^\/]+/ }
  post 'browse/update' => 'browse#update', as: :update_model
  get 'browse/new' => 'browse#new', as: :new_model
  post 'browse/create' => 'browse#create', as: :create_model

  get 'search' => 'search#index', as: :search
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
