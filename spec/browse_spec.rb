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

  context '#update' do
    it 'updates the view' do
      view_tab = create(:view_tab, project: 'labors', model: 'monster', index_order: 1, name: 'stats')
      view_pane = create(:view_pane, view_tab: view_tab, name: 'default')
      size = create(:view_attribute, view_pane: view_pane, index_order: 2, name: 'size')
      weight = create(:view_attribute, view_pane: view_pane, index_order: 1, name: 'weight')
      odor = create(:view_attribute, view_pane: view_pane, index_order: 3, name: 'odor')

      tabs = [
        {
          name: 'statistics',
          panes: [
            {
              name: 'appearance',
              attributes: [
                { name: 'height' },
                { name: 'mass' },
              ]
            },
            {
              name: 'mien',
              attributes: [
                { name: 'odor' }
              ]
            }
          ]
        }
      ]

      auth_header(:admin)
      post('/api/view/labors/monster', tabs: tabs)

      expect(last_response.status).to eq(200)

      # the new panes are in place
      panes = json_body[:view][:tabs][:statistics][:panes]
      expect(panes[:appearance][:attributes].keys).to eq([:height, :mass])
      expect(panes[:mien][:attributes].keys).to eq([:odor])

      # the old pane is gone
      expect(panes[:default]).to be_nil
    end
  end
end
