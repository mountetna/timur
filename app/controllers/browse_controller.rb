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
    @model = Magma.instance.get_model params[:model]
    @record = @model[@model.identity => params[:name]]

    render json: json_payload
  end

  def update
    # Update a model, redirect to the model view
    @model = Magma.instance.get_model params[:model]
    @record = @model[params[:record_id]]

    validate_update(params)

    if @errors.count > 0
      render json: { errors: @errors }, status: 422
      return
    end

    destroy_links editable_attributes(params[:unlink])
    
    create_or_update_links editable_attributes(params[:link])

    # mark any file uploads as changed.
    @model.attributes.select do |name,att|
      att.is_a?(Magma::DocumentAttribute) || att.is_a?(Magma::ImageAttribute)
    end.each do |name, att|
      if params[:values][name]
        @record.modified! name
      end
    end

    begin
      @record.update editable_attributes(params[:values])
    rescue Magma::LoadFailed => m
      logger.info m.complaints
      render json: { errors: m.complaints }, status: 421
      return
    end

    render json: json_payload
  end

  private
  def json_payload
    {
      record: JsonUpdate.updated_document(@record,@model),
      model: JsonUpdate.updated_template(@model),
      editable: can_edit?
    }
  end

  def validate_update params
    @errors = []
    validate_links params[:link] if params[:link]
    validate_values params[:values] if params[:values]
  end

  def validate_links linkset
    # pull up the appropriate model
    linkset.each do |name, links|
      name = name.to_sym
      next if !@model.has_attribute?(name) || links.blank?
      logger.info "Validating #{name} for #{links}"
      @model.attributes[name].validate links, @record do |error|
        @errors.push error
      end
    end
  end

  def validate_values values
    values.each do |name, value|
      name = name.to_sym
      next if !@model.has_attribute?(name) || value.blank?
      @model.attributes[name].validate value, @record do |error|
        @errors.push error
      end
    end
  end

  def editable_attributes atts
    (atts || {}).select do |att,val|
      @model.attributes[att.to_sym] && !@model.attributes[att.to_sym].read_only?
    end
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
