class ViewController < Timur::Controller

  # Get the tab view data. The tab view data is a json representation of a
  # front-end layout.

  def retrieve_view
    query_params = {
      project: @params[:project_name],
      model: @params[:model_name]
    }
    success(pull_view_data(query_params).to_json, 'application/json')
  end

  def update_view
    if @params.key?(:tabs)
      @params[:tabs].each do |tab_name, tab_datum|
        ViewTab.update(
          @params[:project_name],
          @params[:model_name],
          @params[:tabs][tab_name][:name],
          tab_datum
        )
      end

      retrieve_view
    else
      failure(401, {errors: ['There is no tab data to save.']})
    end
  end

  # Remove the view by the model name.
  def delete_view
    query_params = {
      project: @params[:project_name],
      model: @params[:model_name]
    }

    view_tabs = ViewTab.where().all
    view_tabs.each {|tab| tab.remove}

    query_params[:model] = 'all'
    success(pull_view_data(query_params).to_json, 'application/json')
  end

  private

  # Pull the view based upon the project name and model name.
  def pull_view_data(query_params)
    views = {views: {}}
    model_name = query_params[:model]

    # If the model name is 'all' then the user requested 'all' the views for a
    # project, this usually used by the settings/view util page.
    query_params.delete(:model) if query_params[:model] == 'all'

    view_tabs = ViewTab.where(query_params).order(:index_order).all

    # If the tabs for the view are empty (no tabs) then we can send back a
    # generic empty tab set.
    if view_tabs.empty?
      views[:views][model_name] = ViewTab.generate_default_tab(
        query_params[:project],
        query_params[:model]
      )
    else

      view_tabs.each do |tab|
        mdl_nm = tab[:model]

        # For each tab we check to see if it's parent view has already been 
        # set.
        if !views[:views].key?(mdl_nm)
          views[:views][mdl_nm] = {
            model_name: mdl_nm,
            project_name: tab.project,
            tabs: {}
          }
        end

        # Next we check the tab object for the view and set the tab object if 
        # it is not present.
        if !views[:views][mdl_nm][:tabs].key?(tab.name)
          views[:views][mdl_nm][:tabs][tab.name] = tab.to_hash
        end
      end
    end

    return views
  end
end
