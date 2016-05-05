class ProjectJsonUpdate < JsonUpdate
  class Template < JsonUpdate::Template
    sort_order :name, :description, :progress_plot, :cd45_plot, :experiment

    def update
      patch_attribute :progress_plot do |att|
        att.name = :progress_plot
        att.attribute_class = "LinePlotAttribute"
        att.shown = true
        att.display_name = "Progress"
      end

      patch_attribute :cd45_plot do |att|
        att.name = :cd45_plot
        att.attribute_class = "BoxPlotAttribute"
        att.display_name = "Immune fractions (CD45+ / live)"
        att.shown = true
      end
    end
  end
  class Document < JsonUpdate::Document
    def update
      patch_key :progress_plot do |sum|
        # get the relevant samples
        samples = Sample.where('date_of_digest IS NOT NULL').order(:date_of_digest)
        [
          {
            values: samples.map.with_index do |s,i|
              { x: s.date_of_digest, y: i }
            end,
            series: :total,
            color: :mediumseagreen
          },
          {
            values: samples.where(sample_name: /.T1$/).map.with_index do |s,i|
              { x: s.date_of_digest, y: i }
            end,
            series: :tumor,
            color: :indigo
          },
          {
            values: samples.where(sample_name: /.N1$/).map.with_index do |s,i|
              { x: s.date_of_digest, y: i }
            end,
            series: :normal,
            color: :cornflowerblue
          }
        ]
      end

      patch_key :cd45_plot do |sum|
        Experiment.where(:project_id => @record.id).map do |e|
          cd45_counts  = Population.join(:samples, :id => :sample_id)
            .join(:patients, :id => :patient_id )
            .where('experiment_id = ?', e.id)
            .where(stain: 'sort')
            .where(name: "CD45+")
            .order(:sample_id).select_map :count
          live_counts  = Population.join(:samples, :id => :sample_id)
            .join(:patients, :id => :patient_id )
            .where('experiment_id = ?', e.id)
            .where(stain: 'sort')
            .where(name: "Live")
            .order(:sample_id).select_map :count
          # pull cd45 counts and live counts
          counts = cd45_counts.zip(live_counts).reject do |c,l|
            !c || !l
          end
          next if !counts || counts.empty?
          {
            series: e.name,
            values: counts.map do |k|
              (k[0] / k[1].to_f).round(3)
            end
          }
        end.compact
      end

      patch_key :document do |links|
        links.map do |link|
          #doc = @record.document.find{|l| l.identifier == link}
          #link[:summary] = doc.description if doc
          link
        end
      end
    end
  end
end
