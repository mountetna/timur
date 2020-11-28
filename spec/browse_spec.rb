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
        json_body[:view][:tabs][0][:panes][0][:attributes].map{|s| s[:name].to_sym }
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

      panes = json_body[:view][:tabs][0][:panes]

      # the old pane is gone
      expect(panes.map{|p| p[:name].to_sym}).to eq([ :appearance, :mien ])

      # the new panes are in place
      expect(panes[0][:attributes].map{|i| i[:name].to_sym}).to eq([:height, :mass])
      expect(panes[1][:attributes].map{|i| i[:name].to_sym}).to eq([:odor])
    end

    it 'uses a consistent view format' do
      view_tab = create(:view_tab, project: 'labors', model: 'monster', index_order: 1, name: 'stats')
      view_pane = create(:view_pane, view_tab: view_tab, name: 'default')
      size = create(:view_attribute, view_pane: view_pane, index_order: 2, name: 'size')
      weight = create(:view_attribute, view_pane: view_pane, index_order: 1, name: 'weight')
      odor = create(:view_attribute, view_pane: view_pane, index_order: 3, name: 'odor')

      auth_header(:viewer)
      get('/api/view/labors/monster')

      expect(last_response.status).to eq(200)

      auth_header(:admin)
      post('/api/view/labors/monster', tabs: json_body[:view][:tabs])

      expect(last_response.status).to eq(200)
    end
  end
end
