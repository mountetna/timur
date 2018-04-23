class ManifestsController < Timur::Controller
  def fetch
    # Pull the manifests from the database.
    manifests = Manifest.where(
      Sequel[user_id: current_user.id] | Sequel[access: [ 'public', 'view' ]]
    ).where(
      project: @params[:project_name]
    ).all

    success_json(
      manifests: manifests.map { |m| m.to_hash(current_user) }
    )
  end

  def create
    @manifest = Manifest.create(manifest_params)

    success_json(@manifest.to_json(current_user))
  end

  def update
    @manifest = Manifest[@params[:id]]

    raise Etna::Forbidden unless @manifest.is_editable?(current_user)

    @manifest.update(manifest_params)

    success_json(@manifest.to_json(current_user))
  end

  def destroy
    @manifest = Manifest[@params[:id]]

    raise Etna::BadRequest, "No manifest with id #{@params[:id]}" unless @manifest

    raise Etna::Forbidden, 'You cannot edit this manifest' unless @manifest.is_editable?(current_user)

    @manifest.delete

    success('')
  end

  private

  def save_manifest
    if @manifest.save
      render json: { :manifest => @manifest.to_json(current_user, params[:project_name]) }
    else
      error_response(@manifest)
    end
  end

  def manifest_params
    @params.select do |k,v|
      if current_user.is_admin?(@params[:project_name])
        [:name, :data, :description, :access].include?(k)
      else
        [:name, :data, :description].include?(k)
      end
    end.merge(
      user: current_user,
      project: @params[:project_name]
    )
  end
end
