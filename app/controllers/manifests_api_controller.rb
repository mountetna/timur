class ManifestsAPIController < ApplicationController
  before_filter :authenticate

  private

  def authenticate
    if !current_user
      render :json => { :errors => ["You must be logged in."] }, :status => 401 and return
    end
  end

  def authorize
    authorized = @manifest.can_edit?(@current_user)
    if !authorized
      render :json => { :errors => ["You must be the owner to update or delete this manifest."] }, :status => 403
    end
    authorized
  end

  def find_manifest(id)
    @manifest = Manifest.find_by_id(id)
    if @manifest.nil?
      render :json => { :errors => ["Manifest with id: #{id} does not exist."] }, :status => 404
    end
    @manifest
  end

  def error_response(resource)
    render :json => { :errors => resource.errors.full_messages }, :status => 422
  end

  def delete(resource)
    if resource.destroy
      render json: { :success => true }
    else
      error_response(resource)
    end
  end
end