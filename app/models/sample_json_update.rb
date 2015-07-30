class SampleJsonUpdate < JsonUpdate
  sort_order :sample_name, :patient, :headshot, :fingerprint, :qc
  def get_ratio stain, num, *dens
    if stain
      num = stain.send(num) || 0
      den_sum = dens.inject(0) do |sum,den|
        den = [ 1, stain.send(den) || 1 ].max unless den.is_a? Numeric
        sum + den
      end
      num / den_sum.to_f
    else
     0
    end
  end

  def get_dots(model, num, den)
    query = model.where('? IS NOT NULL',num).where('? IS NOT NULL', den).where('? > 0',den).select_map([num,den]).map { |a| a[0]/a[1].to_f }
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
      myeloid = [ :dc1_count, :dc2_count, :peripheral_dc_count, :monocyte_count, :cd14_pos_tam_count, :cd14_neg_tam_count, :neutrophil_count ]
      {
        plot: {
          name: 'fingerprint',
          width: 600,
          height: 350,
          margin: { top: 10, right: 20, bottom: 150, left: 50},
        },
        data: [
          { series: "EPCAM+ tumor/live",
            color: "khaki",
            height: get_ratio(@record.sort_stain, :tumor_count, :live_count),
            dots: get_dots(SortStain, :tumor_count, :live_count)
          },
          { series: "Stroma (CD90+, CD44+)/live",
            color: "khaki",
            height: get_ratio(@record.sort_stain, :stroma_count, :live_count),
            dots: get_dots(SortStain, :stroma_count, :live_count)
          },
          { series: "CD45+/live",
            color: "khaki",
            height: get_ratio(@record.sort_stain, :cd45_count, :live_count),
            dots: get_dots(SortStain, :cd45_count, :live_count)
          },
          { series: "T-regs/CD45+",
            color: "greenyellow",
            height: get_ratio(@record.treg_stain, :treg_count, :cd45_count),
            dots: get_dots(TregStain, :treg_count, :cd45_count)
          },
          { series: "CD4+/CD45+",
            color: "coral",
            height: get_ratio(@record.nktb_stain, :cd4_count, :cd45_count),
            dots: get_dots(NktbStain, :cd4_count, :cd45_count)
          },
          { series: "CD8+/CD45+",
            color: "coral",
            height: get_ratio(@record.nktb_stain, :cd8_count, :cd45_count),
            dots: get_dots(NktbStain, :cd8_count, :cd45_count)
          },
          { series: "NK cells/CD45+",
            color: "coral",
            height: get_ratio(@record.nktb_stain, :nk_count, :cd45_count),
            dots: get_dots(NktbStain, :nk_count, :cd45_count)
          },
          { series: "B-cells/CD45+",
            color: "coral",
            height: get_ratio(@record.nktb_stain, :b_count, :cd45_count),
            dots: get_dots(NktbStain, :b_count, :cd45_count)
          },
          { series: "BDCA1+ DCs/myeloid",
            color: "seagreen",
            height: get_ratio(@record.dc_stain, :dc1_count, *myeloid)
            #dots: get_dots(SortStain, :stroma_count, :live_count)
          },
          { series: "BDCA3+ DCs/myeloid",
            color: "seagreen",
            height: get_ratio(@record.dc_stain, :dc2_count, *myeloid)
            #dots: get_dots(SortStain, :stroma_count, :live_count)
          },
          { series: "pDCs (CD85g+)/myeloid",
            color: "seagreen",
            height: get_ratio(@record.dc_stain, :peripheral_dc_count, *myeloid)
          },
          { series: "CD16+ monocytes/myeloid",
            color: "seagreen",
            height: get_ratio(@record.dc_stain, :monocyte_count, *myeloid)
          },
          { series: "Neutrophils/myeloid",
            color: "seagreen",
            height: get_ratio(@record.dc_stain, :neutrophil_count, *myeloid)
          },
          { series: "CD14+ TAMs/myeloid",
            color: "seagreen",
            height: get_ratio(@record.dc_stain, :cd14_pos_tam_count, *myeloid)
          },
          { series: "CD14- TAMs/myeloid",
            color: "seagreen",
            height: get_ratio(@record.dc_stain, :cd14_neg_tam_count, *myeloid)
          },
        ],
        legend: {
          series: [ "treg", "nk/t/b", "sort", "dc" ],
          colors: [ "greenyellow", "coral", "khaki", "seagreen" ]
        }
      }
    end

    patch_attribute(:qc) do |att|
      att.name = :qc
      att.attribute_class = "BarPlotAttribute"
      att.display_name = "QC"
      att.shown = true
    end

    patch_key :qc do |sum|
      {
        plot: {
          name: 'qc',
          width: 300,
          height: 200,
          margin: { top: 10, right: 20, bottom: 60, left: 50},
        },
        data: [
          {
            series: "CD45+/live",
            color: "khaki",
            height: get_ratio(@record.sort_stain, :cd45_count, :live_count)
          },
          {
            series: "CD45+/live",
            color: "coral",
            height: get_ratio(@record.nktb_stain, :cd45_count, :live_count)
          },
          {
            series: "CD45+/live",
            color: "seagreen",
            height: get_ratio(@record.dc_stain, :cd45_count, :live_count)
          },
          {
            series: "CD45+/live",
            color: "greenyellow",
            height: get_ratio(@record.treg_stain, :cd45_count, :live_count)
          },
        ],
        legend: {
          series: [ "treg", "nk/t/b", "sort", "dc" ],
          colors: [ "greenyellow", "coral", "khaki", "seagreen" ]
        }
      }
    end
    patch_attribute(:weight) {|a| a.placeholder = "Mass in grams"}
    patch_attribute(:ice_time) {|a| a.placeholder = "Time in hours"}
    patch_attribute(:fixation_time) {|a| a.placeholder = "Time in minutes"}
  end
end


