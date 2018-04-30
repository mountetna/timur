class PlotsController < Timur::Controller
  def create
    manifest = Manifest[@params[:manifest_id]]

    raise Etna::BadRequest, 'Missing manifest!' unless manifest

    plot = Plot.new(
      project: @params[:project_name],
      user: current_user,
      access: 'private',
      name: @params[:name],
      plot_type: @params[:plot_type],
      configuration: @params[:configuration],
      manifest: manifest
    )
    plot.save

    success('Plot created')
  end

  def fetch
    # Pull the plots from the database.
    plots = Plot.where(
      (
        Sequel[user: current_user] |
        Sequel[access: [ 'public', 'view' ]]
      ) &
      Sequel[project: @params[:project_name]]
    ).all

    success_json(
      plots: plots.map(&:to_hash)
    )
  end

  def update
    plot = Plot[@params[:id]]
    raise Etna::BadRequest, 'No such plot!' unless plot
    raise Etna::Forbidden, 'Cannot update plot!' unless plot.is_editable?(current_user)
    raise Etna::Forbidden, 'Only admin can set access!' if @params[:access] && !current_user.is_admin?(plot.project)

    plot.update_allowed(@params)

    success('ok')
  end

  def destroy
    plot = Plot[@params[:id]]
    raise Etna::BadRequest, 'No such plot!' unless plot
    raise Etna::Forbidden, 'Cannot destroy plot!' unless plot.is_editable?(current_user)
    plot.destroy
    success('Plot destroyed')
  end

  private

  def save_plot
    if @plot.save
      render json: @plot.as_json
    else
      render :json => { :errors => @plot.errors.full_messages }, :status => 422
    end
  end
end