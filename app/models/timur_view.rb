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
      @record = @model.retrieve(record_name) do |att|
        attributes.include? att.name
      end.all.first

      payload.add_model @model, attributes
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
                [ name, pane.to_hash(@record) ]
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
          att = @model.attributes[att_name]
          att.needs_column? ? att.column_name : nil
        end
      end.flatten.compact.uniq
    end

    def attributes
      @panes.map do |name, pane|
        pane.attributes
      end.flatten.uniq
    end
  end

  class ExtraAttribute
    def initialize att_name, &block
      @name = att_name
      instance_eval(&block)
    end

    def attribute_class txt
      @attribute_class = txt
    end

    def display_name txt
      @display_name = txt
    end

    def data &block
      @data_block = block
    end

    def to_hash record
      {
        attribute: {
          name: @name,
          attribute_class: @attribute_class,
          display_name: @display_name
        },
        data: data_for(record)
      }
    end

    def data_for record
      block = @data_block
      block.call(record)
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

    def to_hash(record)
      {
        title: @title,
        attributes: @attributes,
        display: @display,
        extra: Hash[
          @extra.map do |name,extra_att|
            [ name, extra_att.to_hash(record) ]
          end
        ]
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
      @extra[new_att] = ExtraAttribute.new(new_att, &block)
    end

    def show_all_attributes
      shows *@model.attributes.keys.select{|name| @model.attributes[name].shown? }
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
