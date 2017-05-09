# Structure of the view:
#
# Tabs
# Panes
# Plots
#
# Each tab has a list of panes
# Each pane has a list of attributes
# Each pane also has a data object which specifies a data block to be passed
# into the attribute
#
# To render:
#
# 1. Download the template, which will include Views, Tabs, Panes and Plots
#    These are Timur objects, not Magma objects. Each has a unique key.
#
# 2. Attempt to render the template. On doing so, the Tab will discover that it does not have
#    the correct data to display itself and will make requests.
#
#    a. The tab will request all of the require attributes for the record, and
#       will receive a magma Payload
#
#    b. For each extra attribute there may be a data table request. Grab all of these and receive a magma Matrix for each

class TimurView
  class Tab
    attr_reader :name
    def initialize name, &block
      @name = name
      @panes = {}
      instance_eval &block
    end

    def pane name, &block
      @panes[name] = Pane.new(name,&block)
    end

    def load record_name
      uri = URI.parse('https://magma-dev.ucsf-immunoprofiler.org/retrieve')
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE

      response = http.post(
        uri.path,
        {
          model_name: @model_name,
          record_names: [ record_name ],
          hide_tables: true
        }.to_json,
        {
          "Content-Type" => "application/json",
          "Accept" => "application/json"
        }
      )

      response.each_header do |header,value|
        puts "#{header}\t#{value}"
      end

      if response.code == 200
        @payload = JSON.parse(response.body)
      end
    end

    def to_hash
      {
        panes: Hash[
          @panes.map do |name, pane|
            [ name, pane.to_hash ]
          end
        ]
      }
    end

    private

    def attributes
      @panes.map do |name, pane|
        pane.attributes
      end.flatten.uniq
    end
  end

  class DisplayAttribute
    
    def initialize att_name, &block
      @name = att_name
      @attribute = {
        name: @name
      }
      instance_eval(&block) if block_given?
    end

    [ :attribute_class, :display_name, :plot, :placeholder ].each do |name|
      define_method name do |txt|
        @attribute[name] = txt
      end
    end

    def to_hash
      {
        name: @name,
        attribute: @attribute
      }
    end
  end

  class Pane
    def initialize name, &block
      @name = name
      @attributes = []
      @display = []
      @extra = {}
      instance_eval( &block )
    end

    attr_reader :attributes

    def to_hash
      {
        title: @title,
        display: @display.map(&:to_hash)
      }
    end

    private

    def show *attribute_names, &block
      @display.concat(
        attribute_names.map do |attribute_name|
          DisplayAttribute.new(attribute_name, &block)
        end
      )
    end
    alias_method :shows, :show

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

    def create model_name, tab_name
      view_class = find_view_class(model_name)

      view_class.new(model_name, tab_name)
    end

    private

    def find_view_class model_name
      view_name = "#{model_name.to_s.camel_case}View".to_sym
      begin
        Kernel.const_get view_name
      rescue NameError => e
        raise e unless e.message =~ /uninitialized constant/
        TimurView
      end
    end
  end

  def initialize model_name, tab_name
    @model_name = model_name
    @tab_name = tab_name || tabs.keys.first
    @tab = Tab.new(@tab_name, &tabs[@tab_name])
  end

  def to_json(options={})
    # This is only a TEMPLATE of the view. The actual data is requested
    # separately by the client
    MultiJson.dump(
      tabs: Hash[
        tabs.map do |name, block|
          [ name, name == @tab_name ? @tab.to_hash : nil ]
        end
      ],
      tab_name: @tab_name
    )
  end

  def retrieve
  end

  tab :default do
    pane :default do
    end
  end

  private

  def tabs
    self.class.tabs
  end
end
