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

    # Pull the permissions for the current user.
    admin_user = current_user.whitelist.permissions.select do |permission|
      permission.project_name == params['project_name'] && 
      permission.role == 'administrator'
    end.first

    # Check the current user for admin permissions.
    if admin_user.nil?
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
end