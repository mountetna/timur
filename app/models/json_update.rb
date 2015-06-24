require 'ostruct'
class JsonUpdate
  def initialize model
    @model = model
  end

  def template
    @template ||= @model.json_template
  end

  def json_template
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
    template
  end

  def patch_attribute att
    att_def = OpenStruct.new template[:attributes][att]
    yield att_def
    template[:attributes][att] = att_def.marshal_dump
  end
end
