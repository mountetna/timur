class ProjectJsonUpdate < JsonUpdate
  sort_order :name, :description, :progress_plot, :experiment
  def apply_template!
    super

    patch_attribute :progress_plot do |att|
      att.name = :progress_plot
      att.attribute_class = "ProjectSummaryPlotAttribute"
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

    patch_member :class_set do |set|
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
