require_relative '../view_update'

class BrowseController < Timur::Controller
  def view
    success_json(
      View.where(project_name: @params[:project_name], model_name: @params[:model_name]).first.to_hash
    )
  end

  def update
    require_params :project_name, :model_name, :document

    view = View.find_or_create(project_name: @params[:project_name], model_name: @params[:model_name])

    view.document = @params[:document]

    view.save

    success_json(view.to_hash)
  end
end

