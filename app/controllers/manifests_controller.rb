class ManifestsController < ApplicationController
  include ManifestHelper

  before_filter :authenticate, only: :index
  before_filter :ajax_req_authenticate, except: :index
  layout 'timur'

  def index
    @project_name = params[:project_name]
  end

  def fetch

    # Pull the manifests from the database.
    manifests = Manifest.where(
      '(user_id = ? OR access = ?) AND project = ?',
      current_user.id,
      'public',
      params[:project_name]
    ).all

    # Extract the mainfests that: match the user, is public, or where the user
    # is an admin.
    manifest_json = manifests.map do |manifest|
      #next unless current_user.id == manifest.user_id || manifest.is_public? || @current_user.is_admin?(params[:project_name])

      next unless(
        current_user.id == manifest.user_id ||
        manifest.is_public? ||
        @current_user.is_admin?(params[:project_name])
      )

      manifest.to_json(current_user, params[:project_name])
    end

    render json: { manifests: manifest_json }
  end

  def create
    @manifest = @current_user.manifests.new(manifest_params)
    save_manifest
  end

  def update
    return unless find_manifest(params[:id])
    return unless authorize
    @manifest.assign_attributes(manifest_params)
    save_manifest
  end

  def destroy
    return unless find_manifest(params[:id])
    return unless authorize

    begin
      delete(@manifest)
    rescue ActiveRecord::InvalidForeignKey
      render(json: { errors: ['This manifest is attached to the view and cannot be deleted.'] }, status: 409)
    end
  end

  private

  def save_manifest
    if @manifest.save
      render json: { :manifest => @manifest.to_json(@current_user, params[:project_name]) }
    else
      error_response(@manifest)
    end
  end

  def manifest_params
    if current_user.is_admin?(params[:project_name])
      strong_params = params.permit(:name, :description, :access, :project_name)
    else
      strong_params = params.permit(:name, :description, :project_name)
    end

    strong_params.tap do |whitelisted|
      whitelisted[:data] = params[:data]
    end

    strong_params
  end
end
