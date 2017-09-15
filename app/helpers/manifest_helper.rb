module ManifestHelper
  def authorize
    authorized = @manifest.can_edit?(@current_user, params[:project_name])
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
end
