class BrowseController < Timur::Controller
  def index
    response = Magma::Client.instance.query(
      token,
      @params[:project_name],
      [ :project, '::first', '::identifier' ]
    )

    query = JSON.parse(
      response.body,
      symbolize_names: true
    )

    return redirect_to(
      route_url(
        :browse_model,
        project_name: @params[:project_name],
        model_name: 'project',
        record_name: query[:answer]
      )
    )
  rescue Magma::ClientError => e
    raise Etna::ServerError, 'Could not contact magma'
  end

  def view
    view = ViewTab.retrieve_view(
      @params[:project_name],
      @params[:model_name]
    )
    success(view.to_json, 'application/json')
  end
end
