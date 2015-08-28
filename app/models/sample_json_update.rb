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
      sample_count(@record.population, @record.id, stain, name)
    end
  end

  def sample_count(populations, sid, stain, name)
    name, parent_name = name.split(/##/)
    populations.select do |p|
      p.sample_id == sid && p.stain =~ /#{stain}$/ && p.name == name && (!parent_name || (p.population && p.population.name == parent_name))
    end.map(&:count).first
  end

  def get_dots(stain, num, den)
    samples = Sample.join(:patients, :id => :patient_id).where(:experiment_id => @record.patient.experiment_id).select_map :samples__id
    populations = Population.where(sample_id: samples).all
    
    samples.each do |sample_id|
      compute_ratio num, den do |name|
        sample_count populations, sample_id, stain, name
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
      myeloid = [ "BDCA1+ DCs", "BDCA2+ DCs", "pDCs", "CD16+ Monocytes", "Eosinophils", "Neutrophils", "CD14+ TAMs", "CD14- TAMs" ]
      lineage = [ "CD3+ all", "HLADR-, CD3-, CD56+ (NK)", "B-cells" ]
      {
        plot: {
          name: 'fingerprint',
          width: 800,
          height: 350,
          margin: { top: 10, right: 20, bottom: 150, left: 50},
        },
        data: [
          # overall
          { series: "CD45+/live",
            color: "seagreen",
            height: get_ratio(:sort, "CD45+", "Live"),
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
            color: "chocolate",
            height: get_ratio(:nktb, "CD3+ all", lineage),
            dots: get_dots(:nktb, "CD3+ all", lineage)
          },
          { series: "NK cells/lineage+",
            color: "chocolate",
            height: get_ratio(:nktb, "HLADR-, CD3-, CD56+ (NK)", lineage),
            dots: get_dots(:nktb, "HLADR-, CD3-, CD56+ (NK)", lineage)
          },
          { series: "B-cells/lineage+",
            color: "chocolate",
            height: get_ratio(:nktb, "B-cells", lineage),
            dots: get_dots(:nktb, "B-cells", lineage)
          },


          # t-cell
          { series: "T-regs/CD3+",
            color: "dodgerblue",
            height: get_ratio(:treg, "CD3 all, CD4+, CD25+, FoxP3+ (Tr)", "CD3+ all"),
            dots: get_dots(:treg, "CD3 all, CD4+, CD25+, FoxP3+ (Tr)", "CD3+ all")
          },
          { series: "T-helpers(CD4+,CD25-)/CD3+",
            color: "dodgerblue",
            height: get_ratio(:treg, "CD3 all, CD4+, CD25- (Th)", "CD3+ all"),
            dots: get_dots(:treg, "CD3 all, CD4+, CD25- (Th)", "CD3+ all")
          },
          { series: "CD8+,CD4-/CD3+",
            color: "dodgerblue",
            height: get_ratio(:treg, "Q3: CD8a+ , CD4-##CD3+ all", "CD3+ all"),
            dots: get_dots(:treg, "Q3: CD8a+ , CD4-##CD3+ all", "CD3+ all")
          },
          { series: "CD4+,CD8+/CD3+",
            color: "dodgerblue",
            height: get_ratio(:treg, "Q2: CD8a+ , CD4+##CD3+ all", "CD3+ all"),
            dots: get_dots(:treg, "Q2: CD8a+ , CD4+##CD3+ all", "CD3+ all")
          },
          { series: "CD4-,CD8-/CD3+",
            color: "dodgerblue",
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
          colors: [ "seagreen", "coral", "chocolate", "dodgerblue", "greenyellow", "khaki" ]
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


