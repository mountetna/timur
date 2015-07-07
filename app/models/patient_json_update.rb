class PatientJsonUpdate < JsonUpdate
  def apply_template!
    super

    patch_attribute :notes do |att|
      att.attribute_class = "TextAttribute"
    end
  end
end
