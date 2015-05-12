class BrowseController <  ApplicationController
  before_filter :authenticate

  def index
  end

  def model
    # Get the model name
    @name = params[:model]

    @model = Kernel.const_get @name.camel_case.to_sym
    @record = @model.first
  end

  def update
    # Update a model, redirect to the model view
    @model = Kernel.const_get params[:record].to_sym
    @record = @model[params[:id]]

    @record.update params[:values]

    redirect_to browse_model_path(@model.name.snake_case)
  end
end
