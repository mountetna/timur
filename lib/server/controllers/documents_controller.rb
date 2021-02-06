class DocumentsController < Timur::Controller
  def initialize(request, action = nil)
    super

    @document_type = request.path.match(%r!^/api/(\w+)s/!)&.[](1)

    @document_class = Kernel.const_get(@document_type.capitalize)
  end

  def create
    document = @document_class.new(@document_class.edit_params( params_with_user ))
    raise Etna::Forbidden unless document.is_editable?(current_user)
    document.save
    success_document(document)
  rescue Sequel::ValidationFailed => e
    Timur.instance.logger.log_error(e)
    raise Etna::BadRequest, e.message
  end

  def update
    document = @document_class[
      project_name: @params[:project_name],
      (@document_class.respond_to?(:id) ? @document_class.id : :id) => @params[:id]
    ]
    raise Etna::Forbidden unless document.is_editable?(current_user)
    raise Etna::BadRequest, "No such #{@document_type} #{@params[:id]} in project #{@params[:project_name]}" unless document

    document.update(@document_class.edit_params(params_with_user))

    success_document(document)
  end

  def fetch
    documents = @document_class.where(
      @document_class.fetch_params(params_with_user)
    ).all

    success_json("#{@document_type}s" => documents.map(&:to_hash))
  end

  def get
    document = @document_class[
      project_name: @params[:project_name],
      (@document_class.respond_to?(:id) ? @document_class.id : :id) => @params[:id]
    ]
    raise Etna::NotFound, "No such #{@document_type} #{@params[:id]} in project #{@params[:project_name]}" unless document
    success_document(document)
  end

  def destroy
    document = @document_class[
      project_name: @params[:project_name],
      (@document_class.respond_to?(:id) ? @document_class.id : :id) => @params[:id]
    ]
    raise Etna::BadRequest, "No such #{@document_type} #{@params[:id]} in project #{@params[:project_name]}" unless document
    raise Etna::Forbidden unless document.is_editable?(current_user)
    document.destroy
    success_json( @document_type => {
      (@document_class.respond_to?(:id) ? @document_class.id : :id) => @params[:id]
    })
  end

  private

  def params_with_user
    @params.merge(user: current_user )
  end

  def success_document(document)
    success_json( @document_type => document.to_hash )
  end
end
