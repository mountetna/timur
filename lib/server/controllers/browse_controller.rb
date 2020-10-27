require_relative '../view_update'

class BrowseController < Timur::Controller
  def view
    success_json(
      ViewTab.retrieve_view(@params[:project_name], @params[:model_name])
    )
  end

  def update
    require_params :project_name, :model_name, :tabs

    ViewUpdate.new(
      @params[:project_name], @params[:model_name], @params[:tabs]
    ).run

    success_json(
      ViewTab.retrieve_view(@params[:project_name], @params[:model_name])
    )
  end


  def fetch_view
    model_names = ViewTab.where(project: @params[:project_name])
      .select_map(:model).uniq

    success_json(
      views: model_names.map do |model_name|
        ViewTab.retrieve_view(@params[:project_name], model_name)[:view]
      end
    )
  end
end

