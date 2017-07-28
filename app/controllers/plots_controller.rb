class PlotsController < ManifestsAPIController
  def create
    @plot = @manifest.plots.new(plot_params)
    save_plot
  end

  def update
    return unless find_plot(params[:id])
    save_plot
  end

  def destroy
    return unless find_plot(params[:id])
    delete(@plot)
  end

  private

  def authorize
    return unless find_manifest(params[:manifest_id])
    return unless super
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
      render json: plot.as_json
    else
      render :json => { :errors => @plot.errors.full_messages }, :status => 422
    end
  end

  def plot_params
    params.permit(:name, :type).tap do |whitelisted|
      whitelisted[:configuration] = params[:configuration]
    end
  end

end
