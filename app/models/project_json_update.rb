class ProjectJsonUpdate < JsonUpdate
  sort_order :name, :description, :progress_plot, :cd45_plot, :experiment

  def apply_template!
    super

    patch_attribute :progress_plot do |att|
      att.name = :progress_plot
      att.attribute_class = "LinePlotAttribute"
      att.shown = true
      att.display_name = "Progress"
    end

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

    patch_attribute :cd45_plot do |att|
      att.name = :cd45_plot
      att.attribute_class = "BoxPlotAttribute"
      att.shown = true
      att.display_name = "Immune fractions (%C45+ of live)"
    end

    patch_key :cd45_plot do |sum|
      Experiment.where(:project_id => @record.id).map do |e|
        counts  = SortStain.join(:samples, :id => :sample_id).join(:patients, :id => :patient_id ).join(:experiments, :id => :experiment_id).where('experiments.name = ?', e.name)
          .where('cd45_count IS NOT NULL').where('live_count IS NOT NULL').where('live_count > 0').select_map [ :cd45_count, :live_count ]
        next if !counts || counts.empty?
        {
          series: e.name,
          values: counts.map do |k|
            (k[0] / k[1].to_f).round(3)
          end
        }
      end.compact
    end

    patch_member :skin do |set|
      [ :project ]
    end

    patch_key :document do |links|
      links.map do |link|
        doc = @record.document.find{|l| l.identifier == link[:identifier]}
        link[:summary] = doc.description if doc
        link
      end
    end
  end
end
