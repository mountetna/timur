require_relative './server/controllers/timur_controller'
require_relative './server/controllers/archimedes_controller'
require_relative './server/controllers/browse_controller'
require_relative './server/controllers/documents_controller'
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
      # archimedes_controller.rb
      post 'api/consignment/:project_name', action: 'archimedes#consignment', as: :consignment

      def self.document document_type
        document_path = "api/#{document_type}s/:project_name"

        get "#{document_path}/fetch", action: "documents#fetch", as: :"fetch_#{document_type}s"
        post "#{document_path}/create", action: "documents#create", as: :"create_#{document_type}"
        post "#{document_path}/update/:id", action: "documents#update", as: :"update_#{document_type}"
        delete "#{document_path}/destroy/:id", action: "documents#destroy", as: :"destroy_#{document_type}"
        get "#{document_path}/:id", action: "documents#get", as: :"get_#{document_type}"
      end

      document :plot
      document :manifest
      document :view

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
    end
  end
end
