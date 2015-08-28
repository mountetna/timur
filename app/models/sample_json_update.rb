class SampleJsonUpdate < JsonUpdate
  sort_order :sample_name, :patient, :headshot, :fingerprint, :qc
  def compute_ratio nums, dens
    nums = [ nums ].flatten
    dens = [ dens ].flatten

    num_sum = nums.inject(0) do |sum, name|
      sum + (yield(name) || 0)
    end

    den_sum = dens.inject(0) do |sum,name|
      sum + [ 1, yield(name) || 1 ].max
    end

    num_sum / den_sum.to_f
  end

  def get_ratio stain, num, den
    compute_ratio num, den do |name|
      sample_count(@record, stain, name)
    end
  end

  def sample_count(sample, stain, name)
    sample.population.select{ |s| s.stain == "#{sample.sample_name}.#{stain}" && s.name == name }.map(&:count).first
  end

  def get_dots(stain, num, den)
    Sample.join(:patients, :id => :patient_id).where(:experiment_id => @record.patient.experiment_id).map do |sample|
      # compute a value for this sample if it kills ya
      compute_ratio num, den do |name|
        sample_count sample, stain, name
      end
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
      myeloid = [ "BDCA1+ DCs", "BDCA2+ DCs", "pDCs", "CD16+ Monocytes", "Neutrophils", "CD14+ TAMs", "CD14- TAMs" ]
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
            height: get_ratio(:sort, "EPCAM+", "Live"),
            dots: get_dots(:sort, "EPCAM+", "Live")
          },
          { series: "Stroma (CD90+, CD44+)/live",
            color: "khaki",
            height: get_ratio(:sort, "Q2: CD90+ , CD44+", "Live"),
            dots: get_dots(:sort, "Q2: CD90+ , CD44+", "Live")
          },
          { series: "CD45+/live",
            color: "khaki",
            height: get_ratio(:sort, "CD45+", "Live"),
            dots: get_dots(:sort, "CD45+", "Live")
          },

          { series: "T-regs/CD45+",
            color: "greenyellow",
            height: get_ratio(:treg, "CD3+, HLADR+, CD4+, CD25+, FoxP3+ (Tr)", "CD45+"),
            dots: get_dots(:treg, "CD3+, HLADR+, CD4+, CD25+, FoxP3+ (Tr)", "CD45+")
          },
          #{ series: "CD4+/CD45+",
            #color: "coral",
            #height: get_ratio(:nktb, :cd4_count, "CD45+"),
            #dots: get_dots(:nktb, :cd4_count, "CD45+")
          #},
          #{ series: "CD8+/CD45+",
            #color: "coral",
            #height: get_ratio(:nktb, :cd8_count, "CD45+"),
            #dots: get_dots(:nktb, :cd8_count, "CD45+")
          #},
          { series: "NK cells/CD45+",
            color: "coral",
            height: get_ratio(:nktb, "HLADR-, CD3-, CD56+ (NK)", "CD45+"),
            dots: get_dots(:nktb, "HLADR-, CD3-, CD56+ (NK)", "CD45+")
          },
          { series: "B-cells/CD45+",
            color: "coral",
            height: get_ratio(:nktb, "B-cells", "CD45+"),
            dots: get_dots(:nktb, "B-cells", "CD45+")
          },
          { series: "BDCA1+ DCs/myeloid",
            color: "seagreen",
            height: get_ratio(:dc, "BDCA1+ DCs", myeloid)
            #dots: get_dots(:sort, :stroma_count, "Live")
          },
          { series: "BDCA3+ DCs/myeloid",
            color: "seagreen",
            height: get_ratio(:dc, "BDCA2+ DCs", myeloid)
            #dots: get_dots(:sort, :stroma_count, "Live")
          },
          { series: "pDCs (CD85g+)/myeloid",
            color: "seagreen",
            height: get_ratio(:dc, "pDCs", myeloid)
          },
          { series: "CD16+ monocytes/myeloid",
            color: "seagreen",
            height: get_ratio(:dc, "CD16+ Monocytes", myeloid)
          },
          { series: "Neutrophils/myeloid",
            color: "seagreen",
            height: get_ratio(:dc, "Neutrophils", myeloid)
          },
          { series: "CD14+ TAMs/myeloid",
            color: "seagreen",
            height: get_ratio(:dc, "CD14+ TAMs", myeloid)
          },
          { series: "CD14- TAMs/myeloid",
            color: "seagreen",
            height: get_ratio(:dc, "CD14- TAMs", myeloid)
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
            height: get_ratio(:sort, "CD45+", "Live")
          },
          {
            series: "CD45+/live",
            color: "coral",
            height: get_ratio(:nktb, "CD45+", "Live")
          },
          {
            series: "CD45+/live",
            color: "seagreen",
            height: get_ratio(:dc, "CD45+", "Live")
          },
          {
            series: "CD45+/live",
            color: "greenyellow",
            height: get_ratio(:treg, "CD45+", "Live")
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


