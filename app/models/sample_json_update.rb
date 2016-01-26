class SampleJsonUpdate < JsonUpdate
  class Template < JsonUpdate::Template
    sort_order :sample_name, :patient, :headshot, :fingerprint, :qc

    def update
      patch_attribute :notes do |att|
        att.attribute_class = "TextAttribute"
      end

      patch_attribute :fingerprint do |att|
        att.name = :fingerprint
        att.attribute_class = "BarPlotAttribute"
        att.display_name = "Fingerprint"
        att.shown = true
      end

      patch_attribute(:qc) do |att|
        att.name = :qc
        att.attribute_class = "BarPlotAttribute"
        att.display_name = "QC"
        att.shown = true
      end

      patch_attribute(:weight) {|a| a.placeholder = "Mass in grams"}
      patch_attribute(:ice_time) {|a| a.placeholder = "Time in hours"}
      patch_attribute(:fixation_time) {|a| a.placeholder = "Time in minutes"}
    end
  end

  class Document < JsonUpdate::Document
    def update
      patch_key :fingerprint do |sum|
        FingerprintPlotJson.new(@record).to_json
      end

      patch_key :qc do |sum|
        QcPlotJson.new(@record).to_json
      end
    end
  end
end


