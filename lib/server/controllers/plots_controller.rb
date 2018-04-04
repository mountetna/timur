class PlotsController < Timur::Controller
  def create
    @plot = @manifest.plots.new(plot_params)
    save_plot
    params[:project] = params[:project_name]
    params[:user_id] = current_user.id
    params[:access] = 'private'

    @plot = @manifest.plots.new(plot_params)
    @plot.configuration = plot_configuration
    save_plot
  end

  def fetch
    # Pull the plots from the database.
    plots = Plot.where(
      Sequel[user: current_user] & (
      Sequel[access: [ 'public', 'view' ]] |
      Sequel[project: params[:project_name]])
    ).all

    success_json(
      plots: plots
    )
  end

  def update
    return unless find_plot(params[:id])
    @plot.assign_attributes(plot_params)
    save_plot
  end

  def destroy
    return unless find_plot(params[:id])
    delete(@plot)
  end

  private

  def plot_auth
    return unless find_manifest(params[:manifest_id])
    return unless authorize
  end

  def find_plot(id)
    @plot = Plot.find_by_id(id)
    if @plot.nil?
      render :json => { :errors => ["Plot with id: #{id} does not exist."] }, :status => 404
    end
    @plot
  end

  def save_plot
    if @plot.save
      render json: @plot.as_json
    else
      render :json => { :errors => @plot.errors.full_messages }, :status => 422
    end
  end

  def plot_params
    params.permit(:name, :plot_type).tap do |whitelisted|
      whitelisted[:configuration] = params[:configuration]
    end
  end

end
