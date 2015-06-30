class PatientJsonUpdate < JsonUpdate
  def json_template
    super

    patch_attribute :notes do |att|
      att.attribute_class = "TextAttribute"
    end
    template
  end
end
