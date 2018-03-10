class SettingsController < ApplicationController
  
  before_filter :authenticate, only: :index
  before_filter :ajax_req_authenticate, except: :index
  layout 'timur'

  def index
    @project_name = params[:project_name]
    @settings_page = params[:settings_page]
  end

  # Pull the data for the current user.
  def user_json
    render(json: {
      user: current_user,
      permissions: current_user.whitelist.permissions.select(
        :id,
        :role,
        :project_name
      )
    })
  end

  def update_view_json
    # Check the current user for admin permissions.
    unless is_admin?
      render(
        json: {
          errors: ['You do not have the permissions to edit this data.']
        },
        status: 401
      )
      return
    end

    if params.key?('tabs')
      params['tabs'].each do |tab_name, tab_datum|
        ViewTab.update(
          params['project_name'],
          params['model_name'],
          tab_name,
          tab_datum
        )
      end
    else
      render(
        json: {
          errors: ['There is no tab data to save.']
        },
        status: 400
      )
      return
    end

    # The update went as planned.
    render(
      json: ViewTab.retrieve_view(params['project_name'], params['model_name']),
      status: 200
    )
  end

  def delete_view_json
    # Check the current user for admin permissions.
    unless is_admin?
      render(
        json: {
          errors: ['You do not have the permissions to edit this data.']
        },
        status: 401
      )
      return
    end

    # Remove the view by the model name.
    ViewTab.where({
      project: params['project_name'],
      model: params['model_name']
    }).destroy_all

    # Return all the new views for the project.
    render(
      json: pull_all_views,
      status: 200
    )
  end

  private

  def is_admin?
    # Pull the permissions for the current user.
    admin_user = current_user.whitelist.permissions.select do |permission|
      permission.project_name == params['project_name'] && 
      permission.role == 'administrator'
    end.first

    return !admin_user.nil?
  end

  def pull_all_views
    views = Hash[
      :views,
      {}
    ]

    ViewTab.where(project: params[:project_name]).all.each do |tab|
      view_tab = ViewTab.retrieve_view(tab.project, tab.model)
      views[:views][tab.model] = view_tab[:views][tab.model]
    end
    return views
  end
end