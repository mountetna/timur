class ViewController < Timur::Controller

  # Get the tab view data. The tab view data is a json representation of a
  # front-end layout.

  def view_json
    success(pull_view_data.to_json, 'application/json')
  end

  def update_view_json
    unless current_user.is_admin?(@params[:project_name])
      failure(
        401,
        {errors: ['You do not have the permissions to edit this data.']}
      )
      return
    end

    if @params.key?(:tabs)
      @params[:tabs].each do |tab_name, tab_datum|
        ViewTab.update(
          @params[:project_name],
          @params[:model_name],
          @params[:tabs][tab_name][:name],
          tab_datum
        )
      end
    else
      failure(
        401,
        {errors: ['There is no tab data to save.']}
      )
      return
    end

    success(pull_view_data.to_json, 'application/json')
  end

  def delete_view_json

    unless current_user.is_admin?(@params[:project_name])
      failure(
        401,
        {errors: ['You do not have the permissions to edit this data.']}
      )
      return
    end

    # Remove the view by the model name.
    ViewTab.where({
      project: @params[:project_name],
      model: @params[:model_name]
    }).destroy_all

    success(pull_all_views.to_json, 'application/json')
  end

  private

  def pull_view_data

    # If the model name is 'all' then the user requested 'all' the views for a
    # project, this usually used by the settings/view util page.
    if(@params[:model_name] == 'all')
      views = pull_all_views
    else

      # Pull the view based upon the project name and model name.
      query_params = {
        project: @params[:project_name],
        model: @params[:model_name]
      }
      views = {views: {}}
      tabs = ViewTab.where(query_params).order(:index_order).all

      # If the tabs for the view are empty (no tabs) then we can send back a
      # generic empty tab set.
      if tabs.empty?
        views[:views][@params[:model_name]] = ViewTab.generate_default_tab(
          @params[:project_name],
          @params[:model_name]
        )
      else
        views[:views][@params[:model_name]] = {
          model_name: @params[:model_name],
          project_name: @params[:project_name],
          tabs: Hash[tabs.map {|tab| [tab.name, tab.to_hash] }]
        }
      end
    end

    return views
  end

  def pull_all_views

    # Create the empty base view.
    views = {views: {}}

    # Pull all the tabs for a project.
    view_tabs = ViewTab.where({project: @params[:project_name]})
      .order(:index_order)
      .all

    # Loop each of the tabs and group them by view.
    view_tabs.each do |tab|

      model_name = tab[:model]

      # For each tab we check to see if it's parent view has already been set.
      if !views[:views].key?(model_name)
        views[:views][model_name] = {
          model_name: model_name,
          project_name: tab.project,
          tabs: {}
        }
      end

      # Next we check the tab object for the view and set the tab object if it
      # is not present.
      if !views[:views][model_name][:tabs].key?(tab.name)
        views[:views][model_name][:tabs][tab.name] = tab.to_hash
      end
    end

    return views
  end
end
