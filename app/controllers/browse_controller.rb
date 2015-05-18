class BrowseController <  ApplicationController
  before_filter :authenticate

  def index
    @model = Project
    @record = @model[@model.identity => "UCSF Immunoprofiler"]
  end

  def model
    # Get the model name
    @model = Magma.instance.get_model params[:model]
    @record = @model[@model.identity => params[:name]]
  end

  def update
    # Update a model, redirect to the model view
    @model = Magma.instance.get_model params[:model]
    @record = @model[params[:id]]

    @record.update params[:values]

    redirect_to browse_model_path(@model.name.snake_case, @record.identifier)
  end

  def new
    @params = params
    @model = Magma.instance.get_model params[:model]
  end

  def create
    @model = Magma.instance.get_model params[:model]

    hash = params[:values]
    # add any keys to the hash
    if params[:key]
      params[:key].each do |parent, identifier|
        foreign = Magma.instance.get_model parent
        frecord = foreign[foreign.identity => identifier]
        hash.update :"#{foreign.name.snake_case}_id" => frecord.id
      end
    end
    logger.info hash

    @record = @model.create hash

    redirect_to browse_model_path(@model.name.snake_case, @record.identifier)
  end
end
