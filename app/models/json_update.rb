require 'ostruct'
class JsonUpdate
  class << self
    def updated_document record, model
      document_class(model).new(record).patched_document
    end

    def updated_template model
      template_class(model).new(model).patched_template
    end

    private

    def update_class(model)
      return JsonUpdate unless [Sample,Patient,Project].include? model
      name = "#{model.name.snake_case}_json_update".camel_case.to_sym
      Kernel.const_get name
    end

    def document_class(model)
      update_class = update_class(model)
      if update_class.const_defined? :Document
        update_class.const_get :Document
      else
        JsonUpdate::Document
      end
    end

    def template_class(model)
      update_class = update_class(model)
      if update_class.const_defined? :Template
        update_class.const_get :Template
      else
        JsonUpdate::Template
      end
    end
  end

  class Document
    def initialize record
      @record = record
    end

    def document
      @document ||= @record.json_document
    end

    def patched_document
      @document = nil

      update

      document
    end

    def update
    end

    private

    def patch_key key
      value = document[key]
      document[key] = yield value
    end
  end

  class Template
    def self.sort_order *order
      @sort_order ||= order
    end

    def initialize model
      @model = model
    end

    def patched_template
      @template = nil

      apply_default_patches

      update

      apply_sorts

      template
    end

    def update
    end

    private

    def apply_default_patches
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
    end

    def template
      @template ||= @model.json_template
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
end
