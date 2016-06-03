require 'ostruct'
class JsonUpdate
  class << self
    def updated_template model, attributes
      update_class(model).new(model, attributes).updated_template
    end

    private

    def update_class(model)
      name = "#{model.name}JsonUpdate".to_sym
      begin
        Kernel.const_get name
      rescue NameError => e
        raise e unless e.message =~ /uninitialized constant/
        JsonUpdate
      end
    end
  end

  def self.sort_order *order
    @sort_order ||= order
  end

  def initialize model, attributes = nil
    @model = model
    @attributes = attributes
  end

  def updated_template
    @template = nil

    apply_default_patches

    apply_sorts

    template
  end

  private

  def apply_default_patches
    template[:attributes].each do |name,att|

      att = patch_attribute name do |att|
        att.attribute_class = att.attribute_class.sub(/Magma::/,'')
      end

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
      if att[:attribute_class] == "ForeignKeyAttribute"
        patch_attribute name do |att|
          att.attribute_class = "LinkAttribute"
        end
      end
      if att[:attribute_class] == "ChildAttribute"
        patch_attribute name do |att|
          att.attribute_class = "LinkAttribute"
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
  end

  def template
    @template ||= @model.json_template(@attributes)
  end

  def patch_attribute att
    att_def = OpenStruct.new template[:attributes][att]
    yield att_def
    template[:attributes][att] = att_def.marshal_dump
  end
  
  def patch_member mem
    template[mem] = yield template[mem]
  end

  def apply_sorts
    template[:attributes] = Hash[template[:attributes].sort_by do |name, att|
      self.class.sort_order.index(name) || 1000
    end]
  end
end
