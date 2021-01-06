require_relative '../view_update'

class BrowseController < Timur::Controller
  def view
    view = View.where(project_name: @params[:project_name], model_name: @params[:model_name]).first

    raise Etna::NotFound, "No view for #{@params[:model_name]} in project #{@params[:project_name]}" unless view

    success_json(view.to_hash)
  end

  def update
    require_params :project_name, :model_name, :document

    view = View.find_or_create(project_name: @params[:project_name], model_name: @params[:model_name]) do |v|
      v.document = @params[:document]
    end

    view.update(document: @params[:document])

    success_json(view.to_hash)
  end


  def fetch_view


    success_json(
      View.all.map(&:to_hash)
      )
  end
end

