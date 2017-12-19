class BrowseController < Timur::Controller
  def index
    response = Magma::Client.instance.query(
      token, @params[:project_name], 
      [ :project, '::first', '::identifier' ]
    )

    query = JSON.parse(
      response.body,
      symbolize_names: true
    )
    return redirect_to(
      route_path( :browse_model,
        project_name: @params[:project_name],
        model_name: :project,
        record_name: query[:answer]
      )
    )
  end

  def model
    @project_name, @model_name, @record_name = @params.values_at(
        :project_name,:model_name,:record_name
    )

    return erb_view(:model)
  end

  def map
    @project_name = @params[:project_name]

    return erb_view(:map)
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
    success(view.to_json, 'application/json')
  end

  def update
    begin
      response = Magma::Client.instance.update(
        token,
        @params[:project_name],
        @params[:revisions]
      )
      return success(response.body, 'application/json')
    rescue Magma::ClientError => e
      failure(e.status, e.body)
    end
  end
end
