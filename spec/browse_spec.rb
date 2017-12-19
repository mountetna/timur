describe BrowseController do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  context '#view_json' do
    it 'gets the view json' do
      view_pane = create(:view_pane, project_name: 'labors', view_model_name: 'monster', tab_name: 'stats', name: 'default')
      size = create(:view_attribute, view_pane: view_pane, name: 'size')
      weight = create(:view_attribute, view_pane: view_pane, name: 'weight')
      odor = create(:view_attribute, view_pane: view_pane, name: 'odor')

      get('/labors/view/monster?stats')

      expect(last_response.status).to eq(200)
      json = json_body(last_response.body)

      expect(
        json[:tabs][:stats][:panes][:default][:display].map do |att|
          att[:name]
        end
      ).to eq(['size', 'weight', 'odor'])
    end
  end

  context '#model' do
    it 'returns the model view html' do
      get('/labors/browse/monster/Lernean%20Hydra')

      expect(last_response.status).to eq(200)
      expect(last_response.body).to match(/var PROJECT_NAME = 'labors';/)
      expect(last_response.body).to match(/record_name: 'Lernean Hydra'/)
    end
  end

  context '#map' do
    it 'returns the map view html' do
      get('/labors/map')

      expect(last_response.status).to eq(200)
      expect(last_response.body).to match(/var PROJECT_NAME = 'labors';/)
      expect(last_response.body).to match(/mode: 'map'/)
    end
  end

  context '#update' do
    it 'posts an update to magma' do
      stub_request(
        :post,
        Timur.instance.config(:magma)[:host]+'/update'
      ).with do |req|
        expect(req.body.lines[1]).to eq(%Q{Content-Disposition: form-data; name="revisions[monster][Lernean Hydra][heads]"\r\n})
      end
      json_post('labors/update',
        {
          revisions: {
            monster: {
              'Lernean Hydra': {
                heads: 6
              }
            }
          }
        }
      )
      expect(last_response.status).to eq(200)
    end
  end

  context '#index' do
    it 'redirects to the main project record' do
      stub_request(
        :post,
        Timur.instance.config(:magma)[:host]+'/query'
      ).with(
          body: {
            project_name: "labors",
            query: ["project","::first","::identifier"]
          }.to_json,
      ).to_return(
        status: 200, 
        body: {
          answer: "The Twelve Labors of Hercules"
        }.to_json,
        headers: {}
      )

      get('/labors/browse')
      expect(last_response.status).to eq(302)
      expect(last_response.headers['Location']).to eq(
        'http://example.org/labors/browse/project/The Twelve Labors of Hercules'
      )
    end
  end
end
