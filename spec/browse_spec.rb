describe BrowseController do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  DEFAULT_VIEW= {
    tabs: [
      {
        name: 'stats',
        panes: [
          {
            name: 'default',
            items: [
              { name: 'weight' },
              { name: 'size' },
              { name: 'odor' }
            ]
          }
        ]
      }
    ]
  }

  context '#view' do
    it 'gets the view json with indexes in order' do
      view = create(:view,
        project_name: 'labors',
        model_name: 'monster',
        document: DEFAULT_VIEW
      )

      auth_header(:viewer)
      get('/api/view/labors/monster')

      expect(last_response.status).to eq(200)

      expect(
        json_body[:document][:tabs][0][:panes][0][:items].map{|s| s[:name].to_sym }
      ).to eq([:weight, :size, :odor])
    end

    it 'returns 404 for a non-existent view' do
      auth_header(:viewer)
      get('/api/view/labors/monster')

      expect(last_response.status).to eq(404)

      expect(json_body[:error]).to eq('No view for monster in project labors')
    end
  end

  context '#update' do
    it 'updates the view' do
      view = create(:view,
        project_name: 'labors',
        model_name: 'monster',
        document: DEFAULT_VIEW
      )

      tabs = [
        {
          name: 'statistics',
          panes: [
            {
              name: 'appearance',
              items: [
                { name: 'height' },
                { name: 'mass' },
              ]
            },
            {
              name: 'mien',
              items: [
                { name: 'odor' }
              ]
            }
          ]
        }
      ]

      auth_header(:admin)
      post('/api/view/labors/monster', document: { tabs: tabs })

      expect(last_response.status).to eq(200)
      expect(View.first.document).to eq(JSON.parse(json_body[:document].to_json))

      panes = json_body[:document][:tabs][0][:panes]

      # the old pane is gone
      expect(panes.map{|p| p[:name].to_sym}).to eq([ :appearance, :mien ])

      # the new panes are in place
      expect(panes[0][:items].map{|i| i[:name].to_sym}).to eq([:height, :mass])
      expect(panes[1][:items].map{|i| i[:name].to_sym}).to eq([:odor])
    end

    it 'creates the view' do
      tabs = [
        {
          name: 'statistics',
          panes: [
            {
              name: 'appearance',
              items: [
                { name: 'height' },
                { name: 'mass' },
              ]
            },
            {
              name: 'mien',
              items: [
                { name: 'odor' }
              ]
            }
          ]
        }
      ]

      auth_header(:admin)
      post('/api/view/labors/monster', document: { tabs: tabs })

      expect(last_response.status).to eq(200)
      expect(View.first.document).to eq(JSON.parse(json_body[:document].to_json))

      panes = json_body[:document][:tabs][0][:panes]

      # the new panes are in place
      expect(panes.map{|p| p[:name].to_sym}).to eq([ :appearance, :mien ])
      expect(panes[0][:items].map{|i| i[:name].to_sym}).to eq([:height, :mass])
      expect(panes[1][:items].map{|i| i[:name].to_sym}).to eq([:odor])
    end

    it 'uses a consistent view format' do
      view = create(:view,
        project_name: 'labors',
        model_name: 'monster',
        document: DEFAULT_VIEW
      )

      auth_header(:viewer)
      get('/api/view/labors/monster')

      expect(last_response.status).to eq(200)

      auth_header(:admin)
      post('/api/view/labors/monster', document: json_body[:document])

      expect(last_response.status).to eq(200)
      expect(View.first.document).to eq(JSON.parse(json_body[:document].to_json))
    end
  end
end
