describe 'ManifestsController' do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  def get_manifest endpoint, user
    auth_header(user)
    get("/api/labors/manifests/#{endpoint}")
  end

  def post_manifest endpoint, user, hash={}
    auth_header(user)
    json_post("labors/manifests/#{endpoint}", hash)
  end

  def delete_manifest manifest_id, user
    auth_header(user)
    delete("/labors/manifests/destroy/#{manifest_id}")
  end

  context '#fetch' do
    it 'must be a project viewer' do
      fetch_documents(:manifest, :non_user)
      expect(last_response.status).to eq(403)
    end

    it 'retrieves a list of manifests' do
      admin = create(:user, :admin)
      friend = create(:user, :editor)
      viewer = create(:user, :viewer)

      public_manifests = create_list(:manifest, 3, :public, :script, user: admin)
      friend_private_manifests = create_list(:manifest, 3, :private, :script, user: friend)
      user_private_manifests = create_list(:manifest, 3, :private, :script, user: viewer)

      md5sum = Digest::MD5.hexdigest(public_manifests.first.script)

      fetch_documents(:manifest, :viewer)

      # it returns md5s for each manifest
      manifest_md5s = json_body[:manifests].map{|manifest| manifest[:md5sum]}.uniq
      expect(manifest_md5s).to eq([md5sum])

      # it only returns manifests you can see
      manifest_names = json_body[:manifests].map{|manifest| manifest[:name]}
      expect(manifest_names).to include(*public_manifests.map(&:name))
      expect(manifest_names).to include(*user_private_manifests.map(&:name))
      expect(manifest_names).not_to include(*friend_private_manifests.map(&:name))
    end
  end

  context '#create' do
    before(:each) do
      @manifest = {
        name: 'test manifest',
        description: 'Description',
        access: 'public',
        script: "@value = 1+1"
      }
    end

    it 'must be a project viewer' do
      create_document(:manifest, @manifest, :non_user)
      expect(last_response.status).to eq(403)
    end

    it 'keeps non admins from creating public manifests' do
      create_document(:manifest, @manifest, :viewer)

      expect(last_response.status).to eq(200)
      expect(Manifest.first.access).to eq('private')
    end

    it 'lets admins create public manifests' do
      create_document(:manifest, @manifest, :admin)

      expect(last_response.status).to eq(200)
      expect(Manifest.first.name).to eq('test manifest')
    end

    it 'creates a private manifest' do
      create_document(:manifest, @manifest.merge(access: 'private'), :viewer)

      expect(last_response.status).to eq(200)
      expect(Manifest.first.name).to  eq('test manifest')
    end
  end

  context '#destroy' do
    it 'must be a project user' do
      destroy_document(:manifest, 1, :non_user)
      expect(last_response.status).to eq(403)
    end

    it 'prevents manifest destruction by non-owners' do
      viewer = create(:user, :viewer)
      admin = create(:user, :admin)

      manifest_public = create(:manifest, :private, :script, user: admin)
      manifest_private = create(:manifest, :public, :script, user: admin)

      destroy_document(:manifest, manifest_public.id, :viewer)
      expect(last_response.status).to eq(403)

      destroy_document(:manifest, manifest_private.id, :viewer)
      expect(last_response.status).to eq(403)

      expect(Manifest.count).to eq(2)
    end

    it 'allows admins to destroy public manifests' do
      viewer = create(:user, :viewer)
      admin = create(:user, :admin)
      manifest = create(:manifest, :public, :script, user: viewer)

      destroy_document(:manifest, manifest.id, :admin)
      expect(last_response.status).to eq(200)
      expect(Manifest.count).to eq(0)
    end

    it 'destroys the manifest if allowed' do
      viewer = create(:user, :viewer)
      manifest = create(:manifest, :private, :script, user: viewer)

      destroy_document(:manifest, manifest.id, :viewer)

      expect(Manifest.count).to eq(0)
    end
  end

  context "#update" do
    it "requires permission" do
      viewer = create(:user, :viewer)
      admin = create(:user, :admin)

      manifest_public = create(:manifest, :private, :script, user: admin, description: 'original')
      manifest_private = create(:manifest, :public, :script, user: admin, description: 'original')

      update_document(
        :manifest, manifest_public.id,
        { description: 'changed' },
        :viewer
      )
      expect(last_response.status).to eq(403)

      update_document(
        :manifest, manifest_private.id,
        { description: 'changed' },
        :viewer
      )
      expect(last_response.status).to eq(403)

      manifest_public.refresh
      manifest_private.refresh

      expect(manifest_public.description).to eq('original')
      expect(manifest_private.description).to eq('original')
    end

    it 'allows the owner to change the manifest' do
      viewer = create(:user, :viewer)
      manifest = create(:manifest, :private, :script, user: viewer, description: 'original')

      update_document(
        :manifest, manifest.id, { description: 'changed' }, :viewer
      )
      manifest.refresh

      expect(manifest.description).to eq('changed')
    end

    it 'allows admins to update public manifests' do
      viewer = create(:user, :viewer)
      editor = create(:user, :editor)
      admin = create(:user, :admin)
      manifest = create(:manifest, :public, :script, user: viewer, description: 'original')

      update_document(
        :manifest, manifest.id, { description: 'changed' }, :editor
      )
      manifest.refresh
      expect(manifest.description).to eq('original')

      update_document(
        :manifest, manifest.id, { description: 'changed' }, :admin
      )
      manifest.refresh
      expect(manifest.description).to eq('changed')
    end
  end
end
