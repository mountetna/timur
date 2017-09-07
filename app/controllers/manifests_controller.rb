class ManifestsController < ApplicationController
  before_filter :authenticate
  layout 'timur'

  def index
    @project_name = params[:project_name]
  end

  def fetch

    # Pull the manifests from the database.
    manifests = Manifest.where('user_id = ? OR access = ?', current_user.id, 'public').all

    # Extract the mainfests that: match the user, is public, or where the user
    # is an admin.
    manifest_json = manifests.map do |manifest|
      next unless current_user.id == manifest.user_id || manifest.is_public? || @current_user.is_admin?(params[:project_name])
      manifest.to_json(current_user, params[:project_name])
    end

    render json: { manifests: manifest_json }
  end

  def create
    manifest = Manifest.new(manifest_params)
    manifest.assign_attributes(data: params[:data], user_id: current_user.id)

    if manifest.save
      render json: { manifest: manifest.to_json(current_user, params[:project_name]) }
    else
      error_response(manifest)
    end
  end

  def update
    return unless find_manifest(params[:id])
    return unless authorize(@manifest, params[:project_name])
    @manifest.assign_attributes(manifest_params)
    @manifest.assign_attributes(data: params[:data])

    if @manifest.save
      render json: { manifest: @manifest.to_json(@current_user, params[:project_name])}
    else
      error_response(@manifest)
    end 
  end

  def destroy
    return unless find_manifest(params[:id])
    return unless authorize(@manifest, params[:project_name])
    if @manifest.destroy
      render json: { success: true }
    else
      error_response(@manifest)
    end
  end

  private

  def authenticate
    if !current_user
      render json: { errors: ['You must be logged in.'] }, status: 401
    end
  end

  def authorize(manifest, project_name)
    authorized = manifest.can_edit?(current_user, project_name)
    if !authorized
      render json: { errors: ['You must be the owner to update or delete this manifest.'] }, status: 403
    end
    authorized
  end

  def find_manifest(id)
    @manifest = Manifest.find_by_id(id)
    if @manifest.nil?
      render json: { errors: ['Manifest with id: #{id} does not exist.'] }, status: 404
    end
    @manifest
  end

  def error_response(manifest)
    render json: { errors: manifest.errors.full_messages }, status: 422
  end

  def manifest_params
    if current_user.is_admin?(params[:project_name])
      params.permit(:name, :description, :project, :access)
    else
      params.permit(:name, :description, :project)
    end
  end
end
