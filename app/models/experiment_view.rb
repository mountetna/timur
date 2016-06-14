class ExperimentView < TimurView
  tab :overview do
    pane :default do 
      shows :project, :description, :short_name, :patient
    end
  end

  tab :completion_metrics do
    pane :default do
      adds :completion do
        attribute_class "MetricsAttribute"
        display_name "Completion"
        data do |record|
          {
            categories: {
              clinical: [ "clinical" ],
              processing: [ "headshot" ],
              flow: [ "flowjo_xml", "treg_fcs", "nktb_fcs", "sort_fcs", "dc_fcs", "treg_populations", "nktb_populations", "sort_populations", "dc_populations", "valid_tree" ],
              rna: [ "treg_rna", "tcell_rna", "tumor_rna", "stroma_rna", "live_rna", "myeloid_rna", "treg_gexp", "tcell_gexp", "tumor_gexp", "stroma_gexp", "live_gexp", "myeloid_gexp" ] 
            },
            metrics: {
              "IPICRC001.T1" => {
                clinical: [
                  { name: "clinical", score: 0, message: "No data has been loaded" }
                ],
                processing: [
                  { name: "headshot", score: 0, message: "No image found"}
                ],
                flow: [
                  { name: "flowjo_xml", score: 1, message: "No file found" },
                  { name: "treg_fcs", score: 1, message: "No FCS file loaded"  },
                  { name: "nktb_fcs", score: 1, message: "No FCS file loaded" },
                  { name: "sort_fcs", score: 0, message: "No FCS file loaded"},
                  { name: "dc_fcs", score: 0, message: "No FCS file loaded" },
                  { name: "treg_populations", score: 1, message: "No FCS file loaded"},
                  { name: "nktb_populations", score: 0, message: "No FCS file loaded"},
                  { name: "sort_populations", score: 1, message: "No FCS file loaded"},
                  { name: "dc_populations", score: 0, message: "No FCS file loaded" },
                  { name: "valid_tree", score: 1, message: "No FCS file loaded" }
                ],
                rna: [
                  { name: "treg_rna", score: 0, message: "No FCS file loaded" },
                  { name: "tcell_rna", score: 1, message: "No FCS file loaded" },
                  { name: "tumor_rna", score: 0, message: "No FCS file loaded" },
                  { name: "stroma_rna", score: 1, message: "No FCS file loaded" },
                  { name: "live_rna", score: 0, message: "No FCS file loaded" },
                  { name: "myeloid_rna", score: 1, message: "No FCS file loaded" },
                  { name: "treg_gexp", score: 1, message: "No FCS file loaded" },
                  { name: "tcell_gexp", score: 0, message: "No FCS file loaded" },
                  { name: "tumor_gexp", score: 1, message: "No FCS file loaded" },
                  { name: "stroma_gexp", score: 0, message: "No FCS file loaded" },
                  { name: "live_gexp", score: 1, message: "No FCS file loaded" },
                  { name: "myeloid_gexp", score: 0, message: "No FCS file loaded" }
                ]
              }
            }
          }
        end
      end
    end
  end
end
