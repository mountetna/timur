describe PlotsController do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  def get_plot id, user
    auth_header(user)
    get("/labors/plot/#{id}")
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

  context '#get' do
    it 'must be a project viewer' do
      get_document(:plot, 1, :non_user)
      expect(last_response.status).to eq(403)
    end

    it 'retrieves a single plot' do
      viewer = create(:user, :viewer)

      plot = create(:plot, :private, :scatter, user: viewer)

      get_document(:plot, plot.id, :viewer)
      expect(json_body[:plot][:name]).to eq(plot.name)
    end
  end
  context '#fetch' do
    it 'must be a project viewer' do
      fetch_documents(:plot, :non_user)
      expect(last_response.status).to eq(403)
    end

    it 'retrieves a list of plots' do
      admin = create(:user, :admin)
      friend = create(:user, :editor)
      viewer = create(:user, :viewer)

      public_plots = create_list(:plot, 3, :public, :scatter, user: admin)
      friend_private_plots = create_list(:plot, 3, :private,:scatter, user: friend)
      user_private_plots = create_list(:plot, 3, :private, :scatter, user: viewer)

      fetch_documents(:plot, :viewer)
      plot_names = json_body[:plots].map{|plot| plot[:name]}

      expect(plot_names).to include(*public_plots.map(&:name))
      expect(plot_names).to include(*user_private_plots.map(&:name))
      expect(plot_names).not_to include(*friend_private_plots.map(&:name))
    end
  end

  context '#create' do
    before(:each) do
      @user = create(:user, :viewer)

      @plot = {
        name: 'test plot',
        plot_type: 'scatter',
        project_name: 'ipi',
        access: 'private',
        script: '@test = 1',
        configuration: { data: 'xyz' }
      }
    end

    it 'must be a project viewer' do
      create_document(:plot, @plot, :non_user)
      expect(last_response.status).to eq(403)
    end

    it 'creates a plot' do
      create_document(:plot, @plot, :viewer)

      expect(last_response.status).to eq(200)


      plot = Plot.first
      expect(plot.name).to  eq(@plot[:name])
    end

    it 'keeps non admins from creating public plots' do
      create_document(:plot, @plot.merge(access: 'public'), :viewer)
      expect(last_response.status).to eq(200)
      expect(Plot.first.access).to eq('private')
    end
  end

  context '#destroy' do
    before(:each) do
      @user = create(:user, :viewer)

      @plot = create(
        :plot, :private, :scatter, user: @user
      )
    end

    it 'must be a project user' do
      destroy_document(:plot, @plot.id, :non_user)
      expect(last_response.status).to eq(403)
      expect(Plot.count).to eq(1)
    end

    it 'destroys the plot if allowed' do
      destroy_document(:plot, @plot.id, :viewer)

      expect(Plot.count).to eq(0)
    end

    it 'prevents plot destruction by non-owners' do
      destroy_document(:plot, @plot.id, :editor)
      expect(last_response.status).to eq(403)

      public_plot = create(:plot, :public, :scatter, user: @user)

      destroy_document(:plot, public_plot.id, :editor)
      expect(last_response.status).to eq(403)

      expect(Plot.count).to eq(2)
    end

    it 'allows admins to destroy public plots' do
      destroy_document(:plot, @plot.id, :admin)
      expect(last_response.status).to eq(200)
      expect(Plot.count).to eq(0)
    end
  end

  context '#update' do
    before(:each) do
      @user = create(:user, :viewer)

      @plot = create(:plot, :private, :scatter, user: @user)
    end

    it 'requires permission to update' do
      public_plot = create(:plot, :public, :scatter, user: @user)

      update_document(:plot, @plot.id, { plot_type: 'heatmap' }, :editor)
      expect(last_response.status).to eq(403)

      update_document(:plot, public_plot.id, { plot_type: 'heatmap' }, :editor)
      expect(last_response.status).to eq(403)

      @plot.refresh
      public_plot.refresh

      expect(@plot.plot_type).to eq('scatter')
      expect(public_plot.plot_type).to eq('scatter')
    end

    it 'allows the owner to change the plot' do
      update_document(:plot, @plot.id, { plot_type: 'heatmap', description: 'A basic heatmap' }, :viewer)
      @plot.refresh

      expect(last_response.status).to eq(200)
      expect(@plot.plot_type).to eq('heatmap')
      expect(@plot.description).to eq('A basic heatmap')
    end

    it 'allows admins to update public plots' do
      update_document(:plot, @plot.id, { plot_type: 'heatmap' }, :admin)

      @plot.refresh

      expect(last_response.status).to eq(200)
      expect(@plot.plot_type).to eq('heatmap')
    end

    it 'only lets admins set public access' do
      # when the owner does it, it's no good
      update_document(:plot, @plot.id, { access: 'public' }, :viewer)
      @plot.refresh

      expect(last_response.status).to eq(403)
      expect(@plot.access).to eq('private')

      # however, the admin can set public access
      update_document(:plot, @plot.id, { access: 'public' }, :admin)
      @plot.refresh

      expect(last_response.status).to eq(200)
      expect(@plot.access).to eq('public')
    end
  end
end
