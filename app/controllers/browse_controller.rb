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
end
