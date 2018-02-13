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
    if params.nil? 
      render :json => { :errors => ["View data does not exist."] }, :status => 404
    else
      render :json => { :message => ["View data available."]}, status => 200
    end
  end
end