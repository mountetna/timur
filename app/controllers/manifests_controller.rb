class ManifestsController < ManifestsAPIController
  def index
    manifests = Manifest.where("user_id = ? OR access = ?", @current_user.id, "public").all
    manifest_json = manifests.map{ |manifest| manifest.to_json(@current_user) }
    render json: {"manifests" => manifest_json}
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
      render json: { :manifest => @manifest.to_json(@current_user) }
    else
      error_response(@manifest)
    end
  end

  def manifest_params
    if @current_user.is_admin?
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
