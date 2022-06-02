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

  context '#get' do
    it 'gets the view json' do
      view = create(:view,
        project_name: 'labors',
        model_name: 'monster',
        document: DEFAULT_VIEW
      )

      below_editor_roles.each do |role|
        auth_header(role)
        get('/api/views/labors/monster')

        expect(last_response.status).to eq(200)

        expect(
          json_body[:view][:document][:tabs][0][:panes][0][:items].map{|s| s[:name].to_sym }
        ).to eq([:weight, :size, :odor])
      end
    end

    it 'returns 404 for a non-existent view' do
      below_editor_roles.each do |role|
        auth_header(role)
        get('/api/views/labors/monster')

        expect(last_response.status).to eq(404)

        expect(json_body[:error]).to eq('No such view monster in project labors')
      end
    end
  end

  context '#fetch' do
    it 'gets all the view jsons' do
      view1 = create(:view,
        project_name: 'labors',
        model_name: 'monster',
        document: DEFAULT_VIEW
      )
      view2 = create(:view,
        project_name: 'labors',
        model_name: 'victim',
        document: DEFAULT_VIEW
      )

      below_editor_roles.each do |role|
        auth_header(role)
        get('/api/views/labors/fetch')

        expect(last_response.status).to eq(200)

        expect(json_body[:views].size).to eq(2)
        expect(json_body[:views][0][:document][:tabs][0][:panes][0][:items].map{|s| s[:name].to_sym}
        ).to eq([:weight, :size, :odor])
      end
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
      post('/api/views/labors/update/monster', document: { tabs: tabs })

      expect(last_response.status).to eq(200)
      expect(View.first.document).to eq(JSON.parse(json_body[:view][:document].to_json))

      panes = json_body[:view][:document][:tabs][0][:panes]

      # the old pane is gone
      expect(panes.map{|p| p[:name].to_sym}).to eq([ :appearance, :mien ])

      # the new panes are in place
      expect(panes[0][:items].map{|i| i[:name].to_sym}).to eq([:height, :mass])
      expect(panes[1][:items].map{|i| i[:name].to_sym}).to eq([:odor])
    end

    it 'allows only admins to update the view' do
      view = create(:view,
        project_name: 'labors',
        model_name: 'monster',
        document: DEFAULT_VIEW
      )

      below_admin_roles.each do |role|
        auth_header(role)
        post('/api/views/labors/update/monster', document: { tabs: {} })

        expect(last_response.status).to eq(403)
        expect(View.first.document).to eq(JSON.parse(DEFAULT_VIEW.to_json))
      end
    end

    it 'uses a consistent view format' do
      view = create(:view,
        project_name: 'labors',
        model_name: 'monster',
        document: DEFAULT_VIEW
      )

      auth_header(:viewer)
      get('/api/views/labors/monster')

      expect(last_response.status).to eq(200)

      auth_header(:admin)
      post('/api/views/labors/update/monster', document: json_body[:view][:document])

      expect(last_response.status).to eq(200)
      expect(View.first.document).to eq(JSON.parse(json_body[:view][:document].to_json))
    end
  end

  context '#create' do
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
      post('/api/views/labors/create', model_name: 'monster', document: { tabs: tabs })

      expect(last_response.status).to eq(200)
      expect(View.first.document).to eq(JSON.parse(json_body[:view][:document].to_json))

      panes = json_body[:view][:document][:tabs][0][:panes]

      # the new panes are in place
      expect(panes.map{|p| p[:name].to_sym}).to eq([ :appearance, :mien ])
      expect(panes[0][:items].map{|i| i[:name].to_sym}).to eq([:height, :mass])
      expect(panes[1][:items].map{|i| i[:name].to_sym}).to eq([:odor])
    end
  end

  context '#destroy' do
    it 'destroys the view' do
      view = create(:view,
        project_name: 'labors',
        model_name: 'monster',
        document: DEFAULT_VIEW
      )

      auth_header(:admin)
      delete('/api/views/labors/destroy/monster')

      expect(last_response.status).to eq(200)
      expect(View.count).to eq(0)

      expect(json_body[:view][:model_name]).to eq('monster')
    end
  end
end
