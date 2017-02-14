class SampleView < TimurView
  tab :overview do
    pane :default do 
      title "Summary"
      shows :patient, :headshot, :processed, :description, :notes, :tumor_type
    end
    pane :qc do
      title "Quality Control"
      show :qc do
        attribute_class "BarPlotAttribute"
        display_name "Immune Fractions"
        plot(
          query: {
            name: "qc_@record_name",
            rows: [ "sample", [ "sample_name", "::equals", "@record_name" ] ],
            columns: {
              treg_cd45_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              treg_live_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "Live" ], "::first", "count" ],
              nktb_cd45_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              nktb_live_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "Live" ], "::first", "count" ],
              sort_cd45_count: [ "population", [ "stain", "::equals", "sort" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              sort_live_count: [ "population", [ "stain", "::equals", "sort" ], [ "name", "::equals", "Live" ], "::first", "count" ],
              dc_cd45_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_live_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "Live" ], "::first", "count" ]
            }
          },
          bars: [
            {
              series: "CD45+/live",
              color: "greenyellow",
              height: "treg_cd45_count / treg_live_count",
            },
            {
              series: "CD45+/live",
              color: "coral",
              height: "nktb_cd45_count / nktb_live_count",
            },
            {
              series: "CD45+/live",
              color: "khaki",
              height: "sort_cd45_count / sort_live_count",
            },
            {
              series: "CD45+/live",
              color: "seagreen",
              height: "dc_cd45_count / dc_live_count",
            }
          ]
        )
      end
    end
  end

  tab :processing do
    pane :sample_features do
      title "Characteristics"
      shows :weight, :site, :stage, :grade, :post_digest_cell_count
    end
  end

  tab :flow_cytometry do
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
