require_relative './server/controllers/timur_controller'
require_relative './server/controllers/browse_controller'
require_relative './server/controllers/magma_controller'

class Timur
  class Server < Etna::Server
    # root path
    get '/', action: 'welcome#index'

    # welcome_controller.rb
    get 'static/:path', action: 'welcome#static', as: :static
    get 'login', action: 'welcome#login', as: :login
    get 'auth', action: 'welcome#auth', as: :auth
    get 'no_auth', action: 'welcome#no_auth', as: :no_auth
    get 'auth_error', action: 'welcome#auth_error', as: :auth_error

    # activity_controller.rb
    get ':project_name/activity', action: 'browse#activity', as: :activity

    # browse_controller.rb
    get ':project_name', action: 'browse#index', as: :project
    get ':project_name/browse', action: 'browse#index', as: :browse
    get ':project_name/view/:model_name', action: 'browse#view', as: :view
    get ':project_name/browse/:model_name/*record_name', as: :browse_model do
      erb_view(:model)
    end
    get ':project_name/map', as: :map do
      erb_view(:map)
    end

    # magma_controller.rb
    post ':project_name/update', action: 'magma#update'
    post ':project_name/query', action: 'magma#query'
    post ':project_name/retrieve', action: 'magma#retrieve'
    post ':project_name/retrieve/tsv', action: 'magma#retrieve_tsv'

    # archimedes_controller.rb
    post ':project_name/json/consignment', action: 'search#consignment_json', as: :consignment_json

    # plot_controller.rb
    get ':project_name/plots', action: 'plots#index', as: :plots
    post ':project_name/plots/create', action: 'plots#create', as: :manifests_plots_create
    put ':project_name/plots/update/:id', action: 'plots#update', as: :manifests_plots_update
    delete ':project_name/plots/destroy/:id', action: 'plots#destroy', as: :manifests_plots_destroy

    # manifest_controller.rb
    get ':project_name/manifests', action: 'manifests#index', as: :manifests
    post ':project_name/manifests/fetch', action: 'manifests#fetch', as: :manifests_fetch
    post ':project_name/manifests/create', action: 'manifests#create', as: :manifests_create
    post ':project_name/manifests/update/:id', action: 'manifests#update', as: :manifests_update
    post ':project_name/manifests/destroy/:id', action: 'manifests#destroy', as: :manifests_destroy

    def initialize(config)
      super
      application.setup_db
    end
  end
end
