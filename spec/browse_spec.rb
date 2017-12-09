require 'pry'

describe BrowseController do
  include Rack::Test::Methods
  def app
    OUTER_APP
  end
  it 'should get the view json' do
    create(:view_pane, project_name: 'labors', view_model_name: 'monster')
    get('/labors/view/monster?stats')

    expect(last_response.status).to eq(200)
    json = JSON.parse(last_response.body)

    expect(json.keys).to eq([])
  end
end
