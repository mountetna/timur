class SampleJsonUpdate < JsonUpdate
  sort_order :sample_name, :patient, :headshot, :fingerprint 
  def get_count stain, column, default=0
    if stain
      val = stain.send(column) || default
      val == 0 ? default : val
    else
     default 
    end
  end

  def apply_template!
    # any global patches?
    super

    patch_attribute :notes do |att|
      att.attribute_class = "TextAttribute"
    end

    patch_attribute :fingerprint do |att|
      att.name = :fingerprint
      att.attribute_class = "BarPlotAttribute"
      att.display_name = "Fingerprint"
      att.shown = true
    end

    patch_key :fingerprint do |sum|
      nk_live_count = get_count(@record.nktb_stain, :live_count, 1)
      sort_live_count = get_count(@record.sort_stain, :live_count, 1)
      treg_live_count = get_count(@record.treg_stain, :live_count, 1)
      dc_live_count = get_count(@record.dc_stain, :live_count, 1)
      nk_cd45_count = get_count(@record.nktb_stain, :cd45_count, 1)
      treg_cd45_count = get_count(@record.treg_stain, :cd45_count, 1)
      [
        { series: "EPCAM+ tumor",
          height: get_count(@record.sort_stain, :tumor_count) / sort_live_count.to_f
        },
        { series: "Stroma (CD90+, CD44+)",
          height: get_count(@record.sort_stain, :stroma_count) / sort_live_count.to_f
        },
        { series: "CD45+",
          height: get_count(@record.sort_stain, :cd45_count) / sort_live_count.to_f
        },
        { series: "CD4+",
          height: get_count(@record.nktb_stain, :cd4_count) / nk_cd45_count.to_f
        },
        { series: "CD8+",
          height: get_count(@record.nktb_stain, :cd8_count) / nk_cd45_count.to_f
        },
        { series: "T-regs",
          height: get_count(@record.treg_stain, :treg_count) / treg_cd45_count.to_f
        },
        { series: "NK cells",
          height: get_count(@record.nktb_stain, :nk_count) / nk_live_count.to_f
        },
        { series: "B-cells",
          height: get_count(@record.nktb_stain, :b_count) / nk_live_count.to_f
        },
        { series: "BDCA1+ DCs",
          height: get_count(@record.dc_stain, :dc1_count) / dc_live_count.to_f
        },
        { series: "BDCA3+ DCs",
          height: get_count(@record.dc_stain, :dc2_count) / dc_live_count.to_f
        },
        { series: "pDCs (CD85g+)",
          height: get_count(@record.dc_stain, :peripheral_dc_count) / dc_live_count.to_f
        },
        { series: "CD16+ monocytes",
          height: get_count(@record.dc_stain, :monocyte_count) / dc_live_count.to_f
        },
        { series: "CD14+ TAMs",
          height: get_count(@record.dc_stain, :cd14_pos_tam_count) / dc_live_count.to_f
        },
        { series: "CD14- TAMs",
          height: get_count(@record.dc_stain, :cd14_neg_tam_count) / dc_live_count.to_f
        },
# % live cells (as a housekeeping marker?)
# % CD45 of live
# CD3e
# CD4
# CD8
# T-regs (FoxP3+, CD25+, CD4+)
# BDCA3+ DCs
# NK cells (NKG2b)
# B-cells (CD19)
# EPCAM+ tumor cells
# Stroma (CD90+, CD44+)
# pDCs (CD85g+)
# CD16+ monocytes
# CD14+ TAMs
# BDCA1+ DCs
# CD14- TAMs
      ]
    end

    patch_attribute(:weight) {|a| a.placeholder = "Mass in grams"}
    patch_attribute(:ice_time) {|a| a.placeholder = "Time in hours"}
    patch_attribute(:fixation_time) {|a| a.placeholder = "Time in minutes"}
  end
end


