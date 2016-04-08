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

    render json: json_payload(model, records)
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

    render json: json_payload(@revision.model, [@revision.record])
  end

  private
  def json_payload model, records
    {
      documents: records.map do |record|
        { record.identifier => JsonUpdate.default_document(record,model) }
      end.reduce(:merge),
      patched_documents: records.map do |record|
        { record.identifier => JsonUpdate.updated_document(record,model) }
      end.reduce(:merge),
      template: JsonUpdate.default_template(model),
      patched_template: JsonUpdate.updated_template(model),
    }
  end

  def editable_attributes atts
  end

  def destroy_links links
    links.each do |fname,link|
      logger.info "Attempting to undo link for #{fname} which is a #{ @model.attributes[fname.to_sym].class }"
      @record.delete_link fname
    end
  end

  def create_or_update_links links
    links.each do |fname,link|
      next if link.blank?
      logger.info "Attempting to make #{link} for #{fname} which is a #{ @model.attributes[fname.to_sym].class }"
      @record.create_link(fname.to_sym, link)
    end
  end
end
