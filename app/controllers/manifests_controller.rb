class ManifestsController < ApplicationController
  protect_from_forgery with: :null_session
  before_filter :authenticate

  def index
    manifests = Manifest.where("user_id = ? OR access = ?", @current_user.id, "public").all
    manifestJSON = manifests.map { |manifest| manifest_to_JSON(manifest) }
    render json: {"manifests" => manifestJSON}
  end

  def create
    manifest = Manifest.new(manifest_params)
    manifest.assign_attributes(:data => params[:data], :user_id => @current_user.id)

    if manifest.save
      render json: { :manifest => manifest_to_JSON(manifest) }
    else
      error(manifest)
    end
  end

  def update
    manifest = Manifest.find(params[:id])
    return unless authorize(manifest)
    manifest.assign_attributes(manifest_params)
    manifest.assign_attributes(:data => params[:data])

    if manifest.save
      render json: { :manifest => manifest_to_JSON(manifest) }
    else
      error_response(manifest)
    end 
  end

  def destroy
    manifest = Manifest.find(params[:id])
    return unless authorize(manifest)
    if manifest.destroy
      render json: { :success => true }
    else
      error_response(manifest)
    end
  end

  private

  def authenticate
    if !current_user
      render :json => { :errors => ["You must be logged in."] }, :status => 401 and return
    end
  end

  def manifest_to_JSON(manifest)
    json = manifest.as_json(except: [:user_id], include: { user: { only: :name } })
    json[:is_editable] =  authorized_to_edit?(manifest)
    json
  end

  def authorized_to_edit?(manifest)
    @current_user.id == manifest.user_id || (manifest.is_public? && @current_user.is_admin?)
  end

  def authorize(manifest)
    if !authorized_to_edit?(manifest)
      render :json => { :errors => ["You must be the owner to update or delete this manifest."] }, :status => 403
    end
    authorized_to_edit?(manifest)
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
