describe "View Client" do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  context 'root path' do
    it 'gets the view client for any user' do
      auth_header(:non_user)
      get("/")

      expect(last_response.status).to eq(200)
      expect(last_response.body).to match(/TIMUR_CONFIG/)
      expect(last_response.body).to match(/"project_name":null/)
    end
  end

  context 'project path' do
    it 'gets the view client for a project user' do
      auth_header(:viewer)
      get("/labors")

      expect(last_response.status).to eq(200)
      expect(last_response.body).to match(/TIMUR_CONFIG/)
      expect(last_response.body).to match(/"project_name":"labors"/)
    end

    it 'refuses the view client for a non-user' do
      auth_header(:non_user)
      get("/labors")

      expect(last_response.status).to eq(403)
      expect(json_body[:error]).to eq('You are forbidden from performing this action.')
    end
  end
end
