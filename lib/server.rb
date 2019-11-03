require_relative './server/controllers/timur_controller'
require_relative './server/controllers/archimedes_controller'
require_relative './server/controllers/browse_controller'
require_relative './server/controllers/manifests_controller'
require_relative './server/controllers/plots_controller'

class Timur
  class Server < Etna::Server
    # welcome_controller.rb
    get 'no_auth', as: :no_auth do
      erb_view(:no_auth)
    end

    # root path
    get '/', as: :root do
      erb_view(:client)
    end

    with auth: { user: { can_view?: :project_name } } do
      # browse_controller.rb
      get 'api/view/:project_name/:model_name', action: 'browse#view', as: :view

      # archimedes_controller.rb
      post 'api/consignment/:project_name', action: 'archimedes#consignment', as: :consignment

      def self.document document_type
        document_path = "api/#{document_type}s/:project_name"

        get "#{document_path}/fetch", action: "#{document_type}s#fetch"
        post "#{document_path}/create", action: "#{document_type}s#create"
        post "#{document_path}/update/:id", action: "#{document_type}s#update"
        delete "#{document_path}/destroy/:id", action: "#{document_type}s#destroy"
        get "#{document_path}/:id", action: "#{document_type}s#get"
      end

      document :plot
      document :manifest

      # remaining view routes are parsed by the client and must also be set there
      get ':project_name', as: :project do
        erb_view(:client)
      end

      get ':project_name/*view_path', as: :project_view do
        erb_view(:client)
      end
    end

    def initialize
      super
      application.setup_db
      application.setup_magma
    end
  end
end
