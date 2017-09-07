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
    status, payload = Magma::Client.instance.query(
      token, params[:project_name], [ :project, '::first', '::identifier' ]
    )
    id = JSON.parse(payload, symbolize_names: true)
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

  def view_json
    tab = params[:tab_name] ? params[:tab_name].to_sym : nil
    view = TimurView.create(params[:model_name], tab)
    render(json: view)
  end

  def update
    begin
      status, payload = Magma::Client.instance.update(
        token,
        params[:project_name],
        params[:revisions]
      )
      render json: payload
    rescue Magma::ClientError => e
      render json: e.body, status: e.status
    end
  end
end
