class SampleView < TimurView
  tab :overview do
    pane :default do 
      shows :patient, :headshot, :processed, :description, :tumor_type
    end
    pane :qc do
      title "QC"
      adds :qc do
        attribute_class "BarPlotAttribute"
        display_name "QC"
        data do
          QcPlotJson.new(@record).to_json
        end
      end
    end
  end

  tab :processing do
    pane :sample_features do
      title "Characteristics"
      shows :notes, :weight, :site, :stage, :grade
    end
    
    pane :surgery_digest do
      title "Surgery & Digest"
      shows :physician, :ice_time, :date_of_digest, :date_of_extraction,
        :post_digest_cell_count
    end
  end

  tab :flow_cytometry do
    pane :fingerprint do
      adds :fingerprint do
        attribute_class "BarPlotAttribute"
        display_name "FingerPrint"
        data do
          FingerprintPlotJson.new(@record).to_json
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
