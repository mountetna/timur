class BrowseController < Timur::Controller
  def view
    view = ViewTab.retrieve_view(
      @params[:project_name],
      @params[:model_name]
    )
    success(view.to_json, 'application/json')
  end
end
