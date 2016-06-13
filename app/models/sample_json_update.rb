class SampleJsonUpdate < JsonUpdate
  sort_order :sample_name, :patient, :headshot, :fingerprint, :qc

  def update
    patch_attribute(:notes) {|a| a.attribute_class = "TextAttribute"}
    patch_attribute(:weight) {|a| a.placeholder = "Mass in grams"}
    patch_attribute(:ice_time) {|a| a.placeholder = "Time in hours"}
    patch_attribute(:fixation_time) {|a| a.placeholder = "Time in minutes"}
  end
end


