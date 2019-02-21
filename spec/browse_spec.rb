describe BrowseController do
  include Rack::Test::Methods

  def app
    OUTER_APP
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

      auth_header(:viewer)
      get('/api/view/labors/monster')

      expect(last_response.status).to eq(200)

      expect(
        json_body[:view][:tabs][:stats][:panes][:default][:attributes].keys
      ).to eq([:weight, :size, :odor])
    end
  end
end
