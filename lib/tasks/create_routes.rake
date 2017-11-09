def route_func name, route
  required_parts = route.required_parts

  route_path = route.format( Hash[ required_parts.zip( required_parts.map{|part| %Q{'+#{part}+'} } ) ] )

  %Q!  #{name}_path: function(#{required_parts.join(', ')}) {
    return '#{route_path}';
  }!
end

def route_js
  %Q!
window.Routes = {
#{
  Rails.application.routes.named_routes.map do |name, route|
    route_func(name,route)
  end.join(",\n")
}
};
!
end

namespace :timur do
  desc "Create a routes.js file"
  task create_routes: :environment do
    File.open('public/js/routes.js','w') do |f|
      f.puts route_js
    end
  end
end
