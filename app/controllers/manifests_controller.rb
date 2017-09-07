class ManifestsController < ManifestsAPIController
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
    delete(@manifest)
  end

  private

  def save_manifest
    if @manifest.save
      render json: { :manifest => @manifest.to_json(@current_user, params[:project]) }
    else
      error_response(@manifest)
    end
  end

  def manifest_params
    if current_user.is_admin?(params[:project_name])
      strong_params = params.permit(:name, :description, :project, :access)
    else
      strong_params = params.permit(:name, :description, :project)
    end

    strong_params.tap do |whitelisted|
      whitelisted[:data] = params[:data]
    end

    strong_params
  end
end
