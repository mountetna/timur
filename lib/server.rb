require_relative './server/controllers/timur_controller'
require_relative './server/controllers/browse_controller'

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
    get ':project_name/browse/:model_name/*record_name', action: 'browse#model', as: :browse_model
    get ':project_name/view/:model_name', action: 'browse#view_json', as: :view_json

    # map_controller.rb
    get ':project_name/map', action: 'browse#map', as: :map

    # magma_controller.rb
    post ':project_name/update', action: 'browse#update', as: :update_model
    post ':project_name/retrieve', action: 'search#records_json', as: :records_json
    post ':project_name/query', action: 'search#question_json', as: :question_json

    # search_controller.rb
    get ':project_name/search', action: 'search#index', as: :search
    post ':project_name/search/tsv', action: 'search#table_tsv', as: :table_tsv

    # archimedes_controller.rb
    post ':project_name/json/consignment', action: 'search#consignment_json', as: :consignment_json

    # plot_controller.rb
    get ':project_name/plots', action: 'plots#index', as: :plots
    post ':project_name/manifests/:manifest_id/plots/create', action: 'plots#create', as: :manifests_plots_create
    put ':project_name/manifests/:manifest_id/plots/update/:id', action: 'plots#update', as: :manifests_plots_update
    delete ':project_name/manifests/:manifest_id/plots/destroy/:id', action: 'plots#destroy', as: :manifests_plots_destroy

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
