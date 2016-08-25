class PatientJsonUpdate < JsonUpdate
  def update
    patch_attribute :notes do |att|
      att.attribute_class = "TextAttribute"
    end
    patch_attribute(:ice_time) {|a| a.placeholder = "Time in hours"}
  end
end
