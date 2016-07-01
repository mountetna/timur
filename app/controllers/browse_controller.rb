class BrowseController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  before_filter :editable_check, only: :update
  layout "timur"

  def index
    redirect_to browse_model_path(:project, "UCSF Immunoprofiler")
  end

  def model
    # Get the model name
    @model_name = params[:model]
    @record_name = params[:name]
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
    # Get the model name

    view = TimurView.create(params[:model_name], params[:record_name])
    view.retrieve_tab(params[:tab_name] ? params[:tab_name].to_sym : nil)

    render json: view
  end

  def template_json
    model = Magma.instance.get_model params[:model_name]
    records = model.where(model.identity => params[:record_names]).all

    payload = Magma::Payload.new
    payload.add_model model
    payload.add_records model, records

    render json: TimurPayload.new(
      payload
    )
  end

  def update
    # Update a model, redirect to the model view
    @revision = Magma::Revision.new(params[:revision],params[:model_name], params[:record_name])

    if !@revision.valid?
      render json: { errors: @revision.errors }, status: 422
      return
    end

    begin
      @revision.post!
    rescue Magma::LoadFailed => m
      logger.info m.complaints
      render json: { errors: m.complaints }, status: 421
      return
    end

    Activity.post(current_user, params[:model_name], params[:record_name], 
                  "updated *#{params[:revision].keys.join(", ")}*")

    render json: TimurPayload.new(
      @revision.payload
    )
  end
end
