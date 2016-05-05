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

  def json
    # Get the model name
    model = Magma.instance.get_model params[:model_name]
    records = model.where(model.identity => params[:record_names]).all

    render json: PatchedPayload.new(
      Magma::Payload.new(model, records)
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

    render json: PatchedPayload.new(
      Magma::Payload.new(@revision.model, [@revision.record])
    )
  end
  
  
end
