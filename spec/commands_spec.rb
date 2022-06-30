describe Timur::CreateRoutes do
  it 'generates the routes.js' do
    command = Timur::CreateRoutes.new

    # hard to check this correctly, so let's just ensure
    # it doesn't encode too zealously
    expect(command.route_js).not_to match(%r!(`.*%.*`)!)
  end
end

