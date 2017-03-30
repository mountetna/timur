class ManifestsController < ApplicationController
  before_filter :authenticate

  def index
    manifests = Manifest.where("manifests.id = ? OR manifests.access = 'public'", @current_user.id).all
    manifestJSON = manifests.map { |manifest| manifest_to_JSON(manifest) }
    render json: {"manifests" => manifestJSON}
  end

  def create
    manifest = Manifest.new(manifest_params)
    if manifest.save
      render json: { :manifest => manifest_to_JSON(manifest) }
    else
      error(manifest)
    end
  end

  def update
    manifest = Manifest.find(params[:id])
    authorize(manifest)
    manifest.assign_attributes(manifest_params)
    if manifest.save
      render json: { :manifest => manifest_to_JSON(manifest) }
    else
      error(manifest)
    end 
  end

  def destroy
    manifest = Manifest.find(params[:id])
    authorize(manifest)
    if manifest.destroy
      render json: {:success => true}
    else
      error(manifest)
    end
  end

  private

  def manifest_to_JSON(manifest)
    json = manifest.as_json(except: [:user_id], include: { user: { only: :name } })
    json[:is_editable] =  authorized_to_edit?(manifest)
    json
  end

  def authorized_to_edit?(manifest)
    @current_user.id == manifest.user_id || (manifest.is_public && @current_user.is_admin?)
  end

  def authorize(manifest)
    if !(authorized_to_edit?)
      render :json => { :errors => ["You must be the owner to update or delete this manifest."] }, :status => 401 and return
    end
  end

  def error(manifest)
    render :json => { :errors => manifest.errors.full_messages }, :status => 422 and return
  end

  def manifest_params
    if @current_user.is_admin?
      params.permit(:name, :description, :project, :access, :data)
    else
      params.permit(:name, :description, :project, :data)
    end
  end

end
