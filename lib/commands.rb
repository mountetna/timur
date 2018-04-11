require 'extlib'
require 'date'
require 'logger'

class Timur
  class Help < Etna::Command
    usage 'List this help'

    def execute
      puts 'Commands:'
      Timur.instance.commands.each do |name,cmd|
        puts cmd.usage
      end
    end
  end

  class Migrate < Etna::Command
    usage 'Run migrations for the current environment.'

    def execute(version=nil)
      Sequel.extension(:migration)
      db = Timur.instance.db

      Timur.instance.config(:project_path).split(/\s+/).each do |project_dir|
        if version
          puts "Migrating to version #{version}"
          #Sequel::Migrator.run(db, File.join(project_dir, 'migrations'), table: table, target: version.to_i)
        else
          puts 'Migrating to latest'
          #Sequel::Migrator.run(db, File.join(project_dir, 'migrations'), table: table)
        end
      end
    end

    def setup(config)
      super
      Timur.instance.setup_db
    end
  end

  class Console < Etna::Command
    usage 'Open a console with a connected Timur instance.'

    def execute
      require 'irb'
      ARGV.clear
      IRB.start
    end

    def setup(config)
      super
      Timur.instance.setup_db
      Timur.instance.setup_magma
    end
  end

  class CreateRoutes < Etna::Command
    usage 'Create the routes.js file for the Timur javascript application to use to match routes'

    def route_js
      require_relative 'server'
      %Q!
window.Routes = {
#{
  Timur::Server.routes.map do |route|
    route_func(route)
  end.join(",\n")
}
};
!
    end

    def route_func route
      required_parts = route.parts.map(&:to_sym)
      route_path = route.path(
        Hash[
          required_parts.zip(
            required_parts.map{|part| %Q{'+#{part}+'} }
          )
        ]
      )

      %Q!
  #{route.name}_path: function(#{required_parts.join(', ')}) {
    return '#{route_path}';
  }!
    end

    def execute
      File.open('public/js/routes.js','w') do |f|
        f.puts route_js
      end
    end
  end
end
