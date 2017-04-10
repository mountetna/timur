require 'test_helper'
require 'minitest/autorun'

class ManifestsControllerTest < ActionController::TestCase
  fixtures :users, :whitelists, :manifests

  test "must be logged in" do
    get :index
    assert_response 401

    new_manifest = { :name => "test@test.com", :description => "foobar", :project => "proj", :access => "public", :data => {}}
    
    old_manifest_size = Manifest.all.size
    post :create, :format => :json, :params => new_manifest
    assert_equal Manifest.all.size, old_manifest_size
    assert_response 401

    manifest_public = manifests(:adminPublic)
    manifest_private = manifests(:adminPrivate)

    old_manifest_size = Manifest.all.size
    delete :destroy, id: manifest_public.id
    delete :destroy, id: manifest_private.id
    assert_equal Manifest.all.size, old_manifest_size
    assert_response 401

    put :update, id: manifest_public.id, :format => :json, :params => new_manifest
    assert_equal Manifest.find(manifest_public.id).description, manifest_public.description
    assert_response 401
  end

  test "get list of your manifests and public manifests" do
    log_in_as(users(:admin)) do
      get :index, :format => :json
      assert_response 200

      manifest_public = manifests(:adminPublic)
      manifest_private = manifests(:adminPrivate)

      manifest_response_ids = JSON.parse(response.body)["manifests"].map{ |manifest| manifest["id"] }
      admin_manifests = [manifest_public.id, manifest_private.id]
      assert_equal manifest_response_ids.sort, admin_manifests.sort
    end

    log_in_as(users(:viewer)) do
      get :index, :format => :json
      assert_response 200

      manifest_public = manifests(:adminPublic)
      manifest_private = manifests(:viewerPrivate)

      manifest_response_ids = JSON.parse(response.body)["manifests"].map{ |manifest| manifest["id"] }
      admin_manifests = [manifest_public.id, manifest_private.id]
      assert_equal manifest_response_ids.sort, admin_manifests.sort
    end
  end

  test "non admins cannot create public manifests" do
    viewer = users(:viewer)
    new_manifest = { :name => "test@test.com", :description => "foobar", :access => "public", :project => "proj", :data => {}}

    log_in_as(viewer) do
      old_manifest_count = viewer.manifests.size
      post :create, new_manifest
      
      assert_response 200
      assert_equal viewer.manifests.size, old_manifest_count + 1
      assert !viewer.manifests.all.map{ |manifest| manifest.access }.include?('public')
    end
  end

  test "admins can create public manifests" do
    admin = users(:admin)
    new_manifest = { :name => "test@test.com", :description => "foobar", :access => "public", :project => "proj", :data => {}}

    log_in_as(admin) do
      old_public_manifest_count = admin.manifests.where(:access => "public").size
      post :create, new_manifest
      
      assert_response 200
      new_public_manifest_count = admin.manifests.where(:access => "public").size
      assert_equal new_public_manifest_count, old_public_manifest_count + 1
    end
  end

  test "viewers can only destroy manifests they created" do
    viewer = users(:viewer)
    admin = users(:admin)
    
    log_in_as(viewer) do
      admin_manifest = admin.manifests.first

      delete :destroy, :id => admin_manifest.id
      assert_response 403
      assert Manifest.find(admin_manifest.id)

      viewer_manifest = viewer.manifests.first
      old_manifest_count = viewer.manifests.all.size
      delete :destroy, :id => viewer_manifest.id
      assert_response 200
      assert !viewer.manifests.all.include?(viewer_manifest)
      new_manifest_count = viewer.manifests.all.size
      assert_equal new_manifest_count, old_manifest_count - 1
    end
  end

  test "admins can destroy public manifests" do
    admin2 = users(:admin2)
    admin = users(:admin)
    admin_public_manifest = admin.manifests.where(:access => "public").first
    
    log_in_as(admin2) do
      delete :destroy, :id => admin_public_manifest.id
      assert_response 200
      assert !admin.manifests.all.include?(admin_public_manifest)
    end
  end

  test "viewers can update manifests they created" do
    viewer = users(:viewer)
    manifest = viewer.manifests.first
    update_manifest = { :name => "test@test.com", :description => "test", :project => "proj", :data => { "a" => "b" } }
    update_manifest[:id] = manifest.id

    log_in_as(viewer) do
      put :update, update_manifest
      assert_response 200
      manifest = Manifest.find(manifest.id)
      assert_equal manifest.name, update_manifest[:name]
      assert_equal manifest.description, update_manifest[:description]
      assert_equal manifest.project, update_manifest[:project]
      assert_equal manifest.data, update_manifest[:data]
    end
  end

  test "only admins can update public manifests" do
    viewer = users(:viewer)
    admin = users(:admin)
    admin2 = users(:admin2)
    manifest = admin.manifests.first
    update_manifest = { :name => "test@test.com", :description => "test", :project => "proj", :data => { "a" => "b" }, :access => "private" }
    update_manifest[:id] = manifest.id

    log_in_as(viewer) do
      put :update, update_manifest
      assert_response 403
      manifest = Manifest.find(manifest.id)
      assert_not_equal manifest.name, update_manifest[:name]
      assert_not_equal manifest.description, update_manifest[:description]
      assert_not_equal manifest.project, update_manifest[:project]
      assert_not_equal manifest.data, update_manifest[:data]
      assert_not_equal manifest.access, update_manifest[:access]
    end

    log_in_as(admin2) do
      put :update, update_manifest
      assert_response 200
      manifest = Manifest.find(manifest.id)
      assert_equal manifest.name, update_manifest[:name]
      assert_equal manifest.description, update_manifest[:description]
      assert_equal manifest.project, update_manifest[:project]
      assert_equal manifest.data, update_manifest[:data]
      assert_equal manifest.access, update_manifest[:access]
    end
  end

  #TODO unique by name
  private
    def log_in_as(user)
      @controller.stub(:current_user, user) do
        @controller.instance_variable_set(:@current_user, user)
        yield
      end
    end
end
