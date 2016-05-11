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
    lineage = [ "CD3+ all", "HLADR-,CD3-,CD56+ (NK)", "B-cells" ]
    {
      plot: {
        name: 'fingerprint',
        width: 850,
        height: 350,
        margin: { top: 10, right: 20, bottom: 150, left: 50},
      },
      data: [
        # overall
        best_cd45,
        { series: series_name("EPCAM+ tumor","live", :sort),
          color: "seagreen",
          height: get_ratio(:sort, "EPCAM+", "Live"),
          dots: get_dots(:sort, "EPCAM+", "Live")
        },

        # immune
        { series: series_name("Lineage+","CD45+", :dc),
          color: "coral",
          height: get_ratio(:dc, "Lineage+", "CD45+"),
          dots: get_dots(:dc, "Lineage+", "CD45+")
        },
        { series: series_name("HLADR+,Lineage-","CD45+", :dc),
          color: "coral",
          height: get_ratio(:dc, "HLADR+", "CD45+"),
          dots: get_dots(:dc, "HLADR+", "CD45+")
        },
        { series: series_name("Neutrophils","CD45+", :dc),
          color: "coral",
          height: get_ratio(:dc, "Neutrophils", "CD45+"),
          dots: get_dots(:dc, "Neutrophils", "CD45+")
        },
        { series: series_name("Eosinophils","CD45+", :dc),
          color: "coral",
          height: get_ratio(:dc, "Eosinophils", "CD45+"),
          dots: get_dots(:dc, "Eosinophils", "CD45+")
        },

        #lineage
        { series: series_name("T cells","lineage+", :nktb),
          color: "dodgerblue",
          height: get_ratio(:nktb, "CD3+ all", lineage),
          dots: get_dots(:nktb, "CD3+ all", lineage)
        },
        { series: series_name("NK cells","lineage+", :nktb),
          color: "dodgerblue",
          height: get_ratio(:nktb, "HLADR-,CD3-,CD56+ (NK)", lineage),
          dots: get_dots(:nktb, "HLADR-,CD3-,CD56+ (NK)", lineage)
        },
        { series: series_name("B-cells","lineage+", :nktb),
          color: "dodgerblue",
          height: get_ratio(:nktb, "B-cells", lineage),
          dots: get_dots(:nktb, "B-cells", lineage)
        },


        # t-cell
        { series: series_name("T-regs","CD3+", :treg),
          color: "chocolate",
          height: get_ratio(:treg, "CD3 all,CD4+,CD25+,FoxP3+ (Tr)", "CD3+ all"),
          dots: get_dots(:treg, "CD3 all,CD4+,CD25+,FoxP3+ (Tr)", "CD3+ all")
        },
        { series: series_name("T-helpers(CD4+,CD25-)","CD3+", :treg),
          color: "chocolate",
          height: get_ratio(:treg, "CD3 all,CD4+,CD25- (Th)", "CD3+ all"),
          dots: get_dots(:treg, "CD3 all,CD4+,CD25- (Th)", "CD3+ all")
        },

        # cd4/8

        *get_cd4_8_values,

        # apc
        { series: series_name("CD16+ monocytes","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "CD16+ Monocytes", "HLADR+"),
          dots: get_dots(:dc, "CD16+ Monocytes", "HLADR+"),
        },
        { series: series_name("CD14+ TAMs","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "CD14+ TAMs", "HLADR+"),
          dots: get_dots(:dc, "CD14+ TAMs", "HLADR+")
        },
        { series: series_name("CD14- TAMs","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "CD14- TAMs", "HLADR+"),
          dots: get_dots(:dc, "CD14- TAMs", "HLADR+")
        },
        { series: series_name("CD11c-","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "CD11c-", "HLADR+"),
          dots: get_dots(:dc, "CD11c-", "HLADR+")
        },
        { series: series_name("CD11c+","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "CD11c+", "HLADR+"),
          dots: get_dots(:dc, "CD11c+", "HLADR+")
        },
        { series: series_name("CD14- TAMs","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "CD14- TAMs", "HLADR+"),
          dots: get_dots(:dc, "CD14- TAMs", "HLADR+")
        },
        { series: series_name("BDCA1+ DCs","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "BDCA1+ DCs", "HLADR+"),
          dots: get_dots(:dc, "BDCA1+ DCs", "HLADR+")
        },

        { series: series_name("BDCA3+ DCs","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "BDCA3+ DCs", "HLADR+"),
          dots: get_dots(:dc, "BDCA3+ DCs", "HLADR+")
        },
        { series: series_name("pDCs (CD85g+)","HLADR+", :dc),
          color: "greenyellow",
          height: get_ratio(:dc, "pDCs", "HLADR+"),
          dots: get_dots(:dc, "pDCs", "HLADR+")
        }
      ],
      legend: [
        {
          name: "overall", 
          color: "seagreen",
        },
        {
          name: "immune", 
          color: "coral",
        },
        {
          name: "lineage", 
          color: "dodgerblue",
        },
        {
          name: "t-cell", 
          color: "chocolate",
        },
        {
          name: "cd4/8", 
          color: "magenta",
        },
        {
          name: "apcs",
          color: "greenyellow",
        }
      ]
    }
  end

  private

  def get_cd4_8_values
    from_2 = cd4_8_helper :nktb
    from_2.all? ? from_2 : cd4_8_helper(:treg)
  end

  STAINS = [
    :treg,
    :nktb,
    :sort,
    :dc
  ]

  def series_name num, den, stain
    "#{num}/#{den}(#{STAINS.index(stain)+1})"
  end

  def cd4_8_helper stain
    [
      { series: series_name("CD8-,CD4+", "CD3+", stain),
        color: "magenta",
        height: get_ratio(stain, "Q1: CD8a-,CD4+##CD3+ all", "CD3+ all"),
        dots: get_dots(stain, "Q1: CD8a-,CD4+##CD3+ all", "CD3+ all")
      },
      { series: series_name("CD4+,CD8+","CD3+", stain),
        color: "magenta",
        height: get_ratio(stain, "Q2: CD8a+,CD4+##CD3+ all", "CD3+ all"),
        dots: get_dots(stain, "Q2: CD8a+,CD4+##CD3+ all", "CD3+ all")
      },
      { series: series_name("CD8+,CD4-","CD3+", stain),
        color: "magenta",
        height: get_ratio(stain, "Q3: CD8a+,CD4-##CD3+ all", "CD3+ all"),
        dots: get_dots(stain, "Q3: CD8a+,CD4-##CD3+ all", "CD3+ all")
      },
      { series: series_name("CD4-,CD8-","CD3+", stain),
        color: "magenta",
        height: get_ratio(stain, "Q4: CD8a-,CD4-##CD3+ all", "CD3+ all"),
        dots: get_dots(stain, "Q4: CD8a-,CD4-##CD3+ all", "CD3+ all")
      }
    ]
  end

  def best_cd45
    all_cd45 = [ get_ratio(:sort, "CD45+", "Live"),
                  get_ratio(:treg, "CD45+", "Live"),
                  get_ratio(:dc, "CD45+", "Live"),
                  get_ratio(:nktb, "CD45+", "Live") ]

    if all_cd45[1..3].all?
      height = all_cd45[1..3].inject(:+)/3
      series = "μCD45+/live(2-4)"
    elsif all_cd45[1]
      height = all_cd45[1]
      series = "CD45+/live(2)"
    elsif all_cd45[2]
      height = all_cd45[2]
      series = "CD45+/live(3)"
    elsif all_cd45[3]
      height = all_cd45[3]
      series = "CD45+/live(4)"
    elsif all_cd45[0]
      height = all_cd45[0]
      series = "CD45+/live(1)"
    else
      height = nil
      series = "CD45+/live"
    end
    {
      series: series,
      color: "seagreen",
      height: height,
      dots: get_dots(:sort, "CD45+", "Live")
    }
  end
end
