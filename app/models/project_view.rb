class ProjectView < TimurView
  tab :overview do
    pane :default do 
      shows :description
      adds :qc do
        attribute_class "BoxPlotAttribute"
        display_name "Immune fractions (CD45+ / live)"
        data do |record|
          Cd45Plot.new(record).to_hash
        end
      end

      adds :progress_plot do |att|
        attribute_class "LinePlotAttribute"
        display_name "Progress"
        data do |record|
          ProgressPlot.new(record).to_hash
        end
      end
      shows :whats_new
    end
  end

  tab :experiments do
    pane :default do
      shows :experiment
    end
  end

  tab :project_documents do
    pane :default do
      shows :document
    end
  end

  tab :FAQ do
    pane :default do
      shows :faq
    end
  end
end
