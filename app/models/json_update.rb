require 'ostruct'
class JsonUpdate
  def initialize model, record
    @model = model
    @record = record
    @enabled_extensions = []
  end

  def template
    @template ||= @model.json_template
  end

  def document
    @document ||= @record.json_document
  end

  def self.extension name
    @extensions ||= []
    @extensions.push name
  end

  def self.extensions
    @extensions
  end

  def self.sort_order *order
    @sort_order ||= order
  end

  def extend_template request_exts
    return unless request_exts
    request_exts.each do |name|
      next unless self.class.extensions.include? name.to_sym
      @enabled_extensions.push name.to_sym
    end
  end
  def apply!
    apply_template!
    apply_sorts!
  end

  private
  def apply_template!
    template[:attributes].each do |name,att|
      if att[:type] == "TrueClass"
        patch_attribute name do |att|
          att.attribute_class = "CheckboxAttribute"
        end
      end
      if att[:options]
        patch_attribute name do |att|
          att.attribute_class = "SelectAttribute"
        end
      end
      if att[:type] == "Integer"
        patch_attribute name do |att|
          att.attribute_class = "IntegerAttribute"
        end
      end
      if att[:type] == "Float"
        patch_attribute name do |att|
          att.attribute_class = "FloatAttribute"
        end
      end
      if att[:type] == "DateTime"
        patch_attribute name do |att|
          att.attribute_class = "DateTimeAttribute"
        end
      end
    end

    include_extensions
  end

  def apply_sorts!
    template[:attributes] = Hash[template[:attributes].sort_by do |name, att|
      self.class.sort_order.index(name) || 1000
    end]
  end

  def patch_attribute att
    att_def = OpenStruct.new template[:attributes][att]
    yield att_def
    template[:attributes][att] = att_def.marshal_dump
  end

  def patch_member mem
    template[mem] = yield template[mem]
  end

  def patch_key key
    value = document[key]
    document[key] = yield value
  end

  def include_extensions
    # extension methods should patch the template
    @enabled_extensions.each do |ext|
      send ext
    end
  end
end
