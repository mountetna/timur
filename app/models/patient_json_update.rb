class PatientJsonUpdate < JsonUpdate
  class Template < JsonUpdate::Template
    def update
      patch_attribute :notes do |att|
        att.attribute_class = "TextAttribute"
      end
    end
  end
end
