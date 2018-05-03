require_relative './server/controllers/timur_controller'
require_relative './server/controllers/archimedes_controller'
require_relative './server/controllers/browse_controller'
require_relative './server/controllers/magma_controller'
require_relative './server/controllers/manifests_controller'
require_relative './server/controllers/plots_controller'

class Timur
  class Server < Etna::Server
    # root path
    get '/' do
      erb_view(:welcome)
    end

    # welcome_controller.rb
    get 'no_auth' do
      erb_view(:no_auth)
    end

    with auth: { user: { can_view?: :project_name } } do
      # activity_controller.rb
      get ':project_name/activity', action: 'browse#activity', as: :activity

      # browse_controller.rb
      get ':project_name', action: 'browse#index', as: :project
      get ':project_name/browse', action: 'browse#index', as: :browse
      get ':project_name/view/:model_name', action: 'browse#view', as: :view

      # browse view
      get ':project_name/browse/:model_name/*record_name', as: :browse_model do
        erb_view(:model)
      end

      # search view
      get ':project_name/search', as: :search do
        erb_view(:search)
      end

      # map view
      get ':project_name/map', as: :map do
        erb_view(:map)
      end

      # magma_controller.rb

      # the update endpoint is the only one requiring edit privileges
      post ':project_name/update',
        action: 'magma#update',
        auth: { user: { can_edit?: :project_name } }

      post ':project_name/query', action: 'magma#query'
      post ':project_name/retrieve', action: 'magma#retrieve'
      post ':project_name/retrieve/tsv', action: 'magma#retrieve_tsv'

      # archimedes_controller.rb
      post ':project_name/consignment',
        action: 'archimedes#consignment',
        as: :consignment

      # plot_controller.rb
      get ':project_name/plots', as: :plots do
        erb_view(:plots)
      end

      post ':project_name/plots/fetch', action: 'plots#fetch'
      post ':project_name/plots/create', action: 'plots#create'
      post ':project_name/plots/update/:id', action: 'plots#update'
      delete ':project_name/plots/destroy/:id', action: 'plots#destroy'

      # manifest_controller.rb
      get ':project_name/manifests', as: :manifests do
        erb_view(:manifests)
      end
      get ':project_name/manifests/fetch', action: 'manifests#fetch'
      post ':project_name/manifests/create', action: 'manifests#create'
      post ':project_name/manifests/update/:id', action: 'manifests#update'
      delete ':project_name/manifests/destroy/:id', action: 'manifests#destroy'
    end


    def initialize(config)
      super
      application.setup_db
      application.setup_magma
    end
  end
end
