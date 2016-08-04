class SampleView < TimurView
  tab :overview do
    pane :default do 
      title "Summary"
      shows :patient, :headshot, :processed, :description, :notes, :tumor_type
    end
    pane :qc do
      title "Quality Control"
      adds :qc do
        attribute_class "BarPlotAttribute"
        display_name "Immune Fractions"
        data do |record|
          QcPlotJson.new(record).to_json
        end
      end
    end
  end

  tab :processing do
    pane :sample_features do
      title "Characteristics"
      shows :weight, :site, :stage, :grade, :post_digest_cell_count
    end

    pane :stains do
      title "Stain Panels"
      shows :treg_stain, :nktb_stain, :sort_stain, :dc_stain
    end
  end

  tab :flow_cytometry do
    pane :fingerprint do
      adds :fingerprint do
        attribute_class "BarPlotAttribute"
        display_name "FingerPrint"
        data do |record|
          FingerprintPlotJson.new(record).to_json
        end
      end
    end

    pane :gating do
      title "Gating"
      shows :population
    end
    pane :files do
      title "FCS files"
      shows :treg_file, :nktb_file, :sort_file, :dc_file
    end
  end

  tab :rna_seq do
    pane :default do
      shows :rna_seq
    end
  end

  tab :imaging do
    pane :default do
      shows :imaging
    end
  end
end
