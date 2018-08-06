describe BrowseController do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  def get_browse(endpoint, user=:viewer)
    auth_header(user)
    get("/labors/#{endpoint}")
  end

  context '#view' do
    it 'gets the view json with indexes in order' do
      view_tab = create(:view_tab,
        project: 'labors',
        model: 'monster',
        index_order: 1,
        name: 'stats')
      view_pane = create(:view_pane, view_tab: view_tab, name: 'default')
      size = create(:view_attribute, view_pane: view_pane, index_order: 2, name: 'size')
      weight = create(:view_attribute, view_pane: view_pane, index_order: 1, name: 'weight')
      odor = create(:view_attribute, view_pane: view_pane, index_order: 3, name: 'odor')

      get_browse('view/monster')

      expect(last_response.status).to eq(200)

      expect(
        json_body[:views][:monster][:tabs][:stats][:panes][:default][:attributes].keys
      ).to eq([:weight, :size, :odor])
    end
  end

  context '#model' do
    it 'returns the model view html' do
      get_browse('browse/monster/Lernean%20Hydra')

      expect(last_response.status).to eq(200)
      expect(last_response.body).to match(/TIMUR_CONFIG/)
      expect(last_response.body).to match(/record_name: 'Lernean Hydra'/)
    end
  end

  context '#map' do
    it 'returns the map view html' do
      get_browse('map')

      expect(last_response.status).to eq(200)
      expect(last_response.body).to match(/TIMUR_CONFIG/)
      expect(last_response.body).to match(/mode: 'map'/)
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

      get_browse('browse')
      expect(last_response.status).to eq(302)
      expect(last_response.headers['Location']).to eq(
        'http://example.org/labors/browse/project/The%20Twelve%20Labors%20of%20Hercules'
      )
    end
  end
end
