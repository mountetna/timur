require 'net/http'
require 'mime/types'
require 'uri'
require 'json'

class BrowseController < ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  before_filter :editable_check, only: :update
  layout 'timur'

  def index
    response = Magma::Client.instance.query(
      token, params[:project_name], [ :project, '::first', '::identifier' ]
    )
    id = JSON.parse(response.body, symbolize_names: true)
    redirect_to browse_model_path(params[:project_name], :project, id[:answer])
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

  # Get the tab view data. The tab view data is a json representation of a
  # front-end layout.
  def view_json
    if(params[:model_name] == 'all')
      view = pull_all_views
    else
      view = ViewTab.retrieve_view(params[:project_name], params[:model_name])
    end
    render(json: view)
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
 
  private

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
