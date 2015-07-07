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
      samples = Sample.where('created_at IS NOT NULL').order(:created_at)
      [
        {
          values: samples.map.with_index do |s,i|
            { x: s.created_at, y: i }
          end,
          series: :total,
          color: :mediumseagreen
        },
        {
          values: samples.where(processed: true).map.with_index do |s,i|
            { x: s.created_at, y: i }
          end,
          series: :processed,
          color: :red
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
