describe PlotsController do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  def get_plots endpoint, user
    auth_header(user)
    get("/labors/plots/#{endpoint}")
  end

  def post_plots endpoint, user, hash={}
    auth_header(user)
    json_post("labors/plots/#{endpoint}", hash)
  end

  def delete_plots plot, user
    auth_header(user)
    delete("/labors/plots/destroy/#{plot.id}")
  end

  context '#index' do
    it 'must be a project viewer' do
      get_plots(nil, :non_user)
      expect(last_response.status).to eq(403)
    end
    it 'returns the plots view' do
      get_plots(nil, :viewer)
      expect(last_response.status).to eq(200)
      expect(last_response.body).to match(/mode: 'plots'/)
    end
  end

  context '#fetch' do
    it 'must be a project viewer' do
      post_plots(:fetch, :non_user)
      expect(last_response.status).to eq(403)
    end

    it 'retrieves a list of plots' do
      admin = create(:user, :admin)
      friend = create(:user, :editor)
      viewer = create(:user, :viewer)

      manifest = create(:manifest, :public, :script, user: admin)

      public_plots = create_list(:plot, 3, :public, :scatter, user: admin, manifest: manifest)
      friend_private_plots = create_list(:plot, 3, :private,:scatter, user: friend, manifest: manifest)
      user_private_plots = create_list(:plot, 3, :private, :scatter, user: viewer, manifest: manifest)

      post_plots(:fetch, :viewer)
      plot_names = json_body[:plots].map{|plot| plot[:name]}

      expect(plot_names).to include(*public_plots.map(&:name))
      expect(plot_names).to include(*user_private_plots.map(&:name))
      expect(plot_names).not_to include(*friend_private_plots.map(&:name))
    end
  end

  context '#create' do
    before(:each) do
      @user = create(:user, :viewer)

      @manifest = create(
        :manifest, :public, :script,
        user: @user
      )

      @plot = {
        name: 'test plot',
        plot_type: 'scatter',
        project_name: 'ipi',
        access: 'private',
        configuration: { data: 'xyz' },
        manifest_id: @manifest.id
      }
    end

    it 'must be a project viewer' do
      post_plots(:create, :non_user, @plot)
      expect(last_response.status).to eq(403)
    end

    it 'creates a plot' do
      post_plots(:create, :viewer, @plot)

      expect(last_response.status).to eq(200)

      plot = Plot.first
      expect(plot.name).to  eq(@plot[:name])
    end

    it 'keeps non admins from creating public plots' do
      post_plots(:create, :viewer, @plot.merge(access: 'public'))
      expect(last_response.status).to eq(200)
      expect(Plot.first.access).to eq('private')
    end
  end

  context '#destroy' do
    before(:each) do
      @user = create(:user, :viewer)

      @manifest = create(
        :manifest, :public, :script,
        user: @user
      )

      @plot = create(
        :plot, :private, :scatter, user: @user, manifest: @manifest
      )
    end

    it 'must be a project user' do
      delete_plots(@plot, :non_user)
      expect(last_response.status).to eq(403)
      expect(Plot.count).to eq(1)
    end

    it 'destroys the plot if allowed' do
      delete_plots(@plot, :viewer)

      expect(Plot.count).to eq(0)
    end

    it 'prevents plot destruction by non-owners' do
      delete_plots(@plot, :editor)
      expect(last_response.status).to eq(403)

      public_plot = create(:plot, :public, :scatter, user: @user, manifest: @manifest)

      delete_plots(public_plot, :editor)
      expect(last_response.status).to eq(403)

      expect(Plot.count).to eq(2)
    end

    it 'allows admins to destroy public plots' do
      delete_plots(@plot, :admin)
      expect(last_response.status).to eq(200)
      expect(Plot.count).to eq(0)
    end
  end

  context '#update' do
    before(:each) do
      @user = create(:user, :viewer)

      @manifest = create(
        :manifest, :public, :script,
        user: @user
      )

      @plot = create(:plot, :private, :scatter, user: @user, manifest: @manifest)
    end

    it 'requires permission to update' do
      public_plot = create(:plot, :public, :scatter, user: @user, manifest: @manifest)

      post_plots("update/#{@plot.id}", :editor, plot_type: 'heatmap')
      expect(last_response.status).to eq(403)

      post_plots( "update/#{public_plot.id}", :editor, plot_type: 'heatmap')
      expect(last_response.status).to eq(403)

      @plot.refresh
      public_plot.refresh

      expect(@plot.plot_type).to eq('scatter')
      expect(public_plot.plot_type).to eq('scatter')
    end

    it 'allows the owner to change the plot' do
      post_plots("update/#{@plot.id}", :viewer, plot_type: 'heatmap')
      @plot.refresh

      expect(last_response.status).to eq(200)
      expect(@plot.plot_type).to eq('heatmap')
    end

    it 'allows admins to update public plots' do
      post_plots("update/#{@plot.id}", :admin, plot_type: 'heatmap')

      @plot.refresh

      expect(last_response.status).to eq(200)
      expect(@plot.plot_type).to eq('heatmap')
    end

    it 'only lets admins set public access' do
      # when the owner does it, it's no good
      post_plots("update/#{@plot.id}", :viewer, access: 'public')
      @plot.refresh

      expect(last_response.status).to eq(403)
      expect(@plot.access).to eq('private')

      # however, the admin can set public access
      post_plots("update/#{@plot.id}", :admin, access: 'public')
      @plot.refresh

      expect(last_response.status).to eq(200)
      expect(@plot.access).to eq('public')
    end
  end
end
