class BrowseController < Timur::Controller
  def index
    response = Magma::Client.instance.query(
      token, @params[:project_name], 
      [ :project, '::first', '::identifier' ]
    )

    binding.pry
    query = JSON.parse(
      response.body,
      symbolize_names: true
    )
    redirect_to browse_model_path(
      @params[:project_name],
      :project,
      query[:answer]
    )
  end

  def model
    @project_name = params[:project_name]
    @model_name = params[:model_name]
    @record_name = params[:record_name]
  end

  def map
    @project_name = params[:project_name]
  end

  def activity
    @activities = Activity.order(created_at: :desc).limit(50).map do |activity|
      {
        date: activity.created_at,
        user: activity.user.name,
        model_name: activity.magma_model,
        record_name: activity.identifier,
        action: activity.action
      }
    end
  end

  def view_json
    tab_name = @params[:tab_name] ? @params[:tab_name].to_sym : nil
    view = ViewPane.build_view(@params[:model_name],
                               @params[:project_name],
                               tab_name)
    success('application/json', view.to_json)
  end

  def update
    begin
      response = Magma::Client.instance.update(
        token,
        params[:project_name],
        params[:revisions]
      )
      render json: response.body
    rescue Magma::ClientError => e
      render json: e.body, status: e.status
    end
  end
end
