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

  def update
    # Update a model, redirect to the model view
    @errors = []
    payload = Magma::Payload.new
    params[:revisions].each do |record_name, revision_data|
      revision = Magma::Revision.new(revision_data,
                                      params[:model_name], 
                                      record_name)

      if !revision.valid?
        @errors << @revision.errors
        next
      end

      begin
        revision.post!
      rescue Magma::LoadFailed => m
        logger.info m.complaints
        @errors << m.complaints
        next
      end

      Activity.post(current_user, params[:model_name], 
                    record_name, 
                    "updated *#{revision_data.keys.join(", ")}*")

      payload.add_revision revision
    end

    if !@errors.empty?
      render json: { errors: @errors }, status: 422
      return
    end
    render json: TimurPayload.new(
      payload
    )
  end
end
