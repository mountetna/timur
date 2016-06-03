class TimurView
  class Tab
    attr_reader :name
    def initialize view, name, &block
      @name = name
      @panes = {}
      @view = view
      @model = view.model
      instance_eval &block
    end

    def pane name, &block
      @panes[name] = Pane.new(@view, name,&block)
    end

    def load record_name
      @record = @model.where(@model.identity => record_name).select(*columns).first

      payload.add_model @model, columns
      payload.add_records @model, [ @record ]
    end

    def payload
      @payload ||= Magma::Payload.new
    end

    def to_hash
      TimurPayload.new(payload).to_hash.merge(
        tabs: tab_hash.merge({
          @name => {
            panes: Hash[
              @panes.map do |name, pane|
                [ name, pane.to_hash ]
              end
            ]
          }
        })
      )
    end

    def tab_hash
      # this should define the names of all the tabs
      Hash[
        @view.class.tabs.map do |name, block|
          [ name, nil ]
        end
      ]
    end
    private

    def columns
      @panes.map do |name, pane|
        pane.attributes.map do |att_name|
          Rails.logger.info "Attribute is #{att_name}"
          att = @model.attributes[att_name]
          att.needs_column? ? att.column_name : nil
        end
      end.flatten.compact.uniq
    end
  end

  class Pane
    def initialize view, name, &block
      @view = view
      @model = view.model
      @name = name
      @attributes = []
      @display = []
      @extra = {}
      needs @model.identity, :created_at, :updated_at
      instance_eval( &block )
    end

    attr_reader :attributes

    def to_hash
      {
        title: @title,
        attributes: @attributes,
        extra: @extra
      }
    end

    private

    def shows *attributes
      @attributes.concat attributes
      @display.concat attributes
    end

    def needs *attributes
      @attributes.concat attributes
    end

    def adds new_att, &block
      @display.push new_att
      #@data[new_att] = create_att(&block)
    end

    def show_all_attributes
      shows @model.attributes.keys
    end

    def title txt
      @title = txt
    end
  end

  class << self
    def tab name, &block
      tabs[name] = Proc.new &block
    end

    def tabs
      @tabs ||= {}
    end

    def create model_name, record_name
      model = Magma.instance.get_model model_name

      view_class = find_view_class(model)

      view_class.new(model, record_name)
    end

    private

    def find_view_class model
      view_name = "#{model.name}View".to_sym
      begin
        Kernel.const_get view_name
      rescue NameError => e
        raise e unless e.message =~ /uninitialized constant/
        TimurView
      end
    end
  end

  def initialize model, record_name
    @model = model
    @record_name = record_name
  end

  attr_reader :model

  def to_json(options={})
    MultiJson.dump(
      @tab.to_hash
    )
  end

  tab :default do
    pane :default do
      show_all_attributes
    end
  end

  def retrieve_tab tab_name
    tab_name ||= self.class.tabs.keys.first
    block = self.class.tabs[tab_name]

    @tab = Tab.new(self, tab_name, &block)
    @tab.load @record_name
  end
end
