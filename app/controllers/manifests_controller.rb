class ManifestsController < ApplicationController
  before_filter :authenticate

  def index
    manifests = Manifest.where("manifests.id = ? OR manifests.access = 'public'", @current_user.id).all.as_json
    render json: {"manifests" => manifests}
  end

  def create
  end

  def update
  end

  def destroy
  end
end
