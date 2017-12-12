require 'pry'

describe BrowseController do
  include Rack::Test::Methods
  def app
    OUTER_APP
  end
  it 'should get the view json' do
    view_pane = create(:view_pane, project_name: 'labors', view_model_name: 'monster', tab_name: 'stats', name: 'default')
    size = create(:view_attribute, view_pane: view_pane, name: 'size')
    weight = create(:view_attribute, view_pane: view_pane, name: 'weight')
    odor = create(:view_attribute, view_pane: view_pane, name: 'odor')
    get('/labors/view/monster?stats')

    expect(last_response.status).to eq(200)
    json = json_body(last_response.body)

    expect(json[:tabs][:stats][:panes][:default][:display].map{|att| att[:name]}).to eq(['size', 'weight', 'odor'])
  end

  it 'redirects to the main project record' do
    stub_request(:post, "https://magma-dev.ucsf-immunoprofiler.org//query").
      with(
        body: {
          token: nil,
          project_name: "labors",
          query: ["project","::first","::identifier"]
        }.to_json,
      ).
      to_return(
        status: 200, 
        body: {
          answer: "The Twelve Labors of Hercules"
        }.to_json,
        headers: {}
      )

    get('/labors/browse')

    expect(last_response.status).to eq(302)
  end
end
