class PatientJsonUpdate < JsonUpdate
  def update
    patch_attribute :notes do |att|
      att.attribute_class = "TextAttribute"
    end
  end
end
