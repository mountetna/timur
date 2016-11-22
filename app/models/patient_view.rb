class PatientView < TimurView
  tab :overview do
    pane :data do
      shows :experiment, :sample, :clinical
    end
    pane :processing do 
      title "Processing"
      shows :processor, :notes, :gross_specimen, :received_blood, :ffpe_frozen, :date_of_digest, :date_of_extraction, :physician, :ice_time, :sop_version
    end
    pane :flow do
      title "Flow"
      shows :flojo_file, :stain_version, :flow_pdf, :reference_patient
    end
  end
end
