class ManifestsController < ApplicationController
  protect_from_forgery with: :null_session
  before_filter :authenticate

  def index
    manifests = Manifest.where("user_id = ? OR access = ?", @current_user.id, "public").all
    manifest_json = manifests.map{ |manifest| manifest.to_json(@current_user) }
    render json: {"manifests" => manifest_json}
  end

  def create
    manifest = Manifest.new(manifest_params)
    manifest.assign_attributes(:data => params[:data], :user_id => @current_user.id)

    if manifest.save
      render json: { :manifest => manifest.to_json(@current_user) }
    else
      error_response(manifest)
    end
  end

  def update
    return unless findManifest(params[:id])
    return unless authorize(@manifest)
    @manifest.assign_attributes(manifest_params)
    @manifest.assign_attributes(:data => params[:data])

    if @manifest.save
      render json: { :manifest => @manifest.to_json(@current_user) }
    else
      error_response(@manifest)
    end 
  end

  def destroy
    return unless findManifest(params[:id])
    return unless authorize(@manifest)
    if @manifest.destroy
      render json: { :success => true }
    else
      error_response(@manifest)
    end
  end

  private

  def authenticate
    if !current_user
      render :json => { :errors => ["You must be logged in."] }, :status => 401 and return
    end
  end

  def authorize(manifest)
    authorized = manifest.can_edit?(@current_user)
    if !authorized
      render :json => { :errors => ["You must be the owner to update or delete this manifest."] }, :status => 403
    end
    authorized
  end

  def find_manifest(id)
    @manifest = Manifest.find_by_id(id)
    if @manifest.nil?
      render :json => { :errors => ["Manifest with id: #{id} does not exist."] }, :status => 404
    end
    @manifest
  end

  def error_response(manifest)
    render :json => { :errors => manifest.errors.full_messages }, :status => 422
  end

  def manifest_params
    if @current_user.is_admin?
      params.permit(:name, :description, :project, :access)
    else
      params.permit(:name, :description, :project)
    end
  end
end
