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
          dimensions: {
            width: 300,
            height: 200,
            margin: { top: 10, right: 20, bottom: 60, left: 50},
          },
          legend: [
            {
              name: "treg",
              color: "greenyellow"
            },
            {
              name: "nktb",
              color: "coral"
            },
            {
              name: "sort",
              color: "khaki"
            },
            {
              name: "dc",
              color: "seagreen"
            }
          ],
          bars: [
            {
              name: "CD45+/live",
              color: "greenyellow",
              height: "treg_cd45_count / treg_live_count",
              select: "@record_name"
            },
            {
              name: "CD45+/live",
              color: "coral",
              height: "nktb_cd45_count / nktb_live_count",
              select: "@record_name"
            },
            {
              name: "CD45+/live",
              color: "khaki",
              height: "sort_cd45_count / sort_live_count",
              select: "@record_name"
            },
            {
              name: "CD45+/live",
              color: "seagreen",
              height: "dc_cd45_count / dc_live_count",
              select: "@record_name"
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
      show :finger_print do
        attribute_class "BarPlotAttribute"
        display_name "FingerPrint"
        plot(
          manifest: {
            name: "qc_@record_name",
            rows: [ "sample", [ "patient", "experiment", "name", "::equals", [ "sample", [ "sample_name", "::equals", "record_name" ], "::first", "patient", "experiment", "name" ] ] ],
            columns: {
              treg_cd45_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              nktb_cd45_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              sort_cd45_count: [ "population", [ "stain", "::equals", "sort" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_cd45_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              treg_live_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "Live" ], "::first", "count" ],
              nktb_live_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "Live" ], "::first", "count" ],
              sort_live_count: [ "population", [ "stain", "::equals", "sort" ], [ "name", "::equals", "Live" ], "::first", "count" ],
              dc_live_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "Live" ], "::first", "count" ],
              sort_epcam_count: [ "population", [ "stain", "::equals", "sort" ], [ "name", "::equals", "EPCAM+" ], "::first", "count" ],
              dc_lineage_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "Lineage+" ], "::first", "count" ],
              dc_hladr_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "HLADR+" ], "::first", "count" ],
              dc_neutrophil_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "Neutrophils" ], "::first", "count" ],
              dc_eosinophil_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "Eosinophils" ], "::first", "count" ],
              nktb_cd3_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "CD3+ all" ], "::first", "count" ],
              nktb_nk_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "HLADR-,CD3-,CD56+ (NK)" ], "::first", "count" ],
              nktb_bcell_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "B-cells" ], "::first", "count" ],

              nktb_cd4_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "Q1: CD8a-,CD4+" ], [ "ancestry", "::matches", "^CD3\+ all" ], "::first", "count" ],
              nktb_cd8_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "Q2: CD8a+,CD4+" ], [ "ancestry", "::matches", "^CD3\+ all" ], "::first", "count" ],
              nktb_dn_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "Q3: CD8a+,CD4-" ], [ "ancestry", "::matches", "^CD3\+ all" ], "::first", "count" ],
              nktb_dp_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "Q4: CD8a-,CD4-" ], [ "ancestry", "::matches", "^CD3\+ all" ], "::first", "count" ],

              treg_treg_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              treg_thelper_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              treg_cd3_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_monocyte_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_hladr_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_cd14pos_tam_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_cd14neg_tam_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_cd11cpos_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_cd11cneg_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_bdca1_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_bdca3_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
              dc_pdc_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
            }
          },
          dimensions: {
            width: 300,
            height: 200,
            margin: { top: 10, right: 20, bottom: 60, left: 50},
          },
          legend: [
            {
              name: "treg",
              color: "greenyellow"
            },
            {
              name: "nktb",
              color: "coral"
            },
            {
              name: "sort",
              color: "khaki"
            },
            {
              name: "dc",
              color: "seagreen"
            }
          ],
          bars: [
            {
              name: "CD45+/live",
              color: "greenyellow",
              height: "sort_cd45_count / sort_live_count",
              select: "@record_name"
            },
            {
              name: "EPCAM+ tumor/live",
              color: "coral",
              height: "sort_epcam_count / sort_live_count",
              select: "@record_name"
            },
            {
              name: "Lineage+/CD45+",
              color: "khaki",
              height: "dc_lineage_count / dc_cd45_count",
              select: "@record_name"
            },
            {
              name: "HLADR+,Lineage-/CD45+ (dc)",
              color: "seagreen",
              height: "dc_hladr_count / dc_cd45_count",
              select: "@record_name"
            }
          ]
        )
      end
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
      shows :he_low, :he_high, :he_zstack
    end
  end
end
