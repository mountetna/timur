class FingerprintPlotJson
  include PlotHelper
  include PopulationHelper

  attr_reader :record, :indication

  def initialize record
    @record = record
    @indication = record.patient.experiment
  end

  def to_json
    myeloid = [ "BDCA1+ DCs", "BDCA2+ DCs", "pDCs", "CD16+ Monocytes", "Eosinophils", "Neutrophils", "CD14+ TAMs", "CD14- TAMs" ]
    lineage = [ "CD3+ all", "HLADR-, CD3-, CD56+ (NK)", "B-cells" ]
    all_cd45 = [ get_ratio(:sort, "CD45+", "Live"),
                  get_ratio(:treg, "CD45+", "Live"),
                  get_ratio(:dc, "CD45+", "Live"),
                  get_ratio(:nktb, "CD45+", "Live") ].compact
    {
      plot: {
        name: 'fingerprint',
        width: 800,
        height: 350,
        margin: { top: 10, right: 20, bottom: 150, left: 50},
      },
      data: [
        # overall
        { series: "μCD45+/live",
          color: "seagreen",
          height: all_cd45.empty? ? nil : all_cd45.inject(:+)/all_cd45.size.to_f,
          dots: get_dots(:sort, "CD45+", "Live")
        },
        { series: "EPCAM+ tumor/live",
          color: "seagreen",
          height: get_ratio(:sort, "EPCAM+", "Live"),
          dots: get_dots(:sort, "EPCAM+", "Live")
        },

        # immune
        { series: "Lineage+/CD45+",
          color: "coral",
          height: get_ratio(:dc, "Lineage+", "CD45+"),
          dots: get_dots(:dc, "Lineage+", "CD45+")
        },
        { series: "HLADR+,Lineage-/CD45+",
          color: "coral",
          height: get_ratio(:dc, "HLADR+", "CD45+"),
          dots: get_dots(:dc, "HLADR+", "CD45+")
        },
        { series: "Neutrophils/CD45+",
          color: "coral",
          height: get_ratio(:dc, "Neutrophils", "CD45+"),
          dots: get_dots(:dc, "Neutrophils", "CD45+")
        },
        { series: "Eosinophils/CD45+",
          color: "coral",
          height: get_ratio(:dc, "Eosinophils", "CD45+"),
          dots: get_dots(:dc, "Eosinophils", "CD45+")
        },

        #lineage
        { series: "T cells/lineage+",
          color: "dodgerblue",
          height: get_ratio(:nktb, "CD3+ all", lineage),
          dots: get_dots(:nktb, "CD3+ all", lineage)
        },
        { series: "NK cells/lineage+",
          color: "dodgerblue",
          height: get_ratio(:nktb, "HLADR-, CD3-, CD56+ (NK)", lineage),
          dots: get_dots(:nktb, "HLADR-, CD3-, CD56+ (NK)", lineage)
        },
        { series: "B-cells/lineage+",
          color: "dodgerblue",
          height: get_ratio(:nktb, "B-cells", lineage),
          dots: get_dots(:nktb, "B-cells", lineage)
        },


        # t-cell
        { series: "T-regs/CD3+",
          color: "chocolate",
          height: get_ratio(:treg, "CD3 all, CD4+, CD25+, FoxP3+ (Tr)", "CD3+ all"),
          dots: get_dots(:treg, "CD3 all, CD4+, CD25+, FoxP3+ (Tr)", "CD3+ all")
        },
        { series: "T-helpers(CD4+,CD25-)/CD3+",
          color: "chocolate",
          height: get_ratio(:treg, "CD3 all, CD4+, CD25- (Th)", "CD3+ all"),
          dots: get_dots(:treg, "CD3 all, CD4+, CD25- (Th)", "CD3+ all")
        },
        { series: "CD8+,CD4-/CD3+",
          color: "chocolate",
          height: get_ratio(:treg, "Q3: CD8a+ , CD4-##CD3+ all", "CD3+ all"),
          dots: get_dots(:treg, "Q3: CD8a+ , CD4-##CD3+ all", "CD3+ all")
        },
        { series: "CD4+,CD8+/CD3+",
          color: "chocolate",
          height: get_ratio(:treg, "Q2: CD8a+ , CD4+##CD3+ all", "CD3+ all"),
          dots: get_dots(:treg, "Q2: CD8a+ , CD4+##CD3+ all", "CD3+ all")
        },
        { series: "CD4-,CD8-/CD3+",
          color: "chocolate",
          height: get_ratio(:treg, "Q4: CD8a- , CD4-##CD3+ all", "CD3+ all"),
          dots: get_dots(:treg, "Q4: CD8a- , CD4-##CD3+ all", "CD3+ all")
        },

        # apc
        { series: "CD16+ monocytes/HLADR+",
          color: "greenyellow",
          height: get_ratio(:dc, "CD16+ Monocytes", "HLADR+"),
          dots: get_dots(:dc, "CD16+ Monocytes", "HLADR+"),
        },
        { series: "CD14+ TAMs/HLADR+",
          color: "greenyellow",
          height: get_ratio(:dc, "CD14+ TAMs", "HLADR+"),
          dots: get_dots(:dc, "CD14+ TAMs", "HLADR+")
        },
        { series: "CD14- TAMs/HLADR+",
          color: "greenyellow",
          height: get_ratio(:dc, "CD14- TAMs", "HLADR+"),
          dots: get_dots(:dc, "CD14- TAMs", "HLADR+")
        },
        { series: "CD11c-/HLADR+",
          color: "greenyellow",
          height: get_ratio(:dc, "CD11c-", "HLADR+"),
          dots: get_dots(:dc, "CD11c-", "HLADR+")
        },
        { series: "CD11c+/HLADR+",
          color: "greenyellow",
          height: get_ratio(:dc, "CD11c+", "HLADR+"),
          dots: get_dots(:dc, "CD11c+", "HLADR+")
        },
        { series: "CD14- TAMs/HLADR+",
          color: "greenyellow",
          height: get_ratio(:dc, "CD14- TAMs", "HLADR+"),
          dots: get_dots(:dc, "CD14- TAMs", "HLADR+")
        },
        { series: "BDCA1+ DCs/HLADR+",
          color: "greenyellow",
          height: get_ratio(:dc, "BDCA1+ DCs", "HLADR+"),
          dots: get_dots(:dc, "BDCA1+ DCs", "HLADR+")
        },

        # sub-apc
        { series: "BDCA3+ DCs/HLADR+",
          color: "khaki",
          height: get_ratio(:dc, "BDCA3+ DCs", "HLADR+"),
          dots: get_dots(:dc, "BDCA3+ DCs", "HLADR+")
        },
        { series: "pDCs (CD85g+)/HLADR+",
          color: "khaki",
          height: get_ratio(:dc, "pDCs", "HLADR+"),
          dots: get_dots(:dc, "pDCs", "HLADR+")
        }
      ],
      legend: {
        series: [ "overall", "immune", "lineage", "t-cell", "apcs", "rare apcs" ],
        colors: [ "seagreen", "coral", "dodgerblue", "chocolate", "greenyellow", "khaki" ]
      }
    }
  end
end
