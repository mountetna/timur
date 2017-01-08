class ProjectView < TimurView
  tab :overview do
    pane :default do 
      shows :description
      adds :qc do
        attribute_class "BoxPlotAttribute"
        display_name "Immune fractions (CD45+ / live)"
        data(
          query: {
            name: "immune_fraction_by_sample",
            rows: [ "sample", [ "patient", "::has", "experiment" ] ],
            columns: {
              sample_name: [ "sample_name" ],
              experiment_name: [ "patient", "experiment", "name" ],
              cd45_count: [ "population", 
                            [ "name", "::equals", "CD45+" ],
                            [ "stain", "::equals", "sort" ],
                            "::first", "count" ],
              live_count: [ "population", 
                            [ "name", "::equals", "Live" ],
                            [ "stain", "::equals", "sort" ],
                            "::first", "count" ],
            }
          },
          category: "experiment_name",
          value: "cd45_count / live_count"
        )
      end

      adds :progress_plot do |att|
        attribute_class "LinePlotAttribute"
        display_name "Progress"
        data(
          query: [
            {
              name: "progress_total",
              rows: [ "sample", [ "patient", "::has", "date_of_digest" ] ],
              columns: {
                date_of_digest: [ "patient", "date_of_digest" ],
              },
              order: "date_of_digest",
            },
            {
              name: "progress_tumor",
              rows: [
                "sample", 
                [ "patient", "::has", "date_of_digest" ],
                [ "sample_name", "::matches", '\.T.$' ],
              ],
              columns: {
                date_of_digest: [ "patient", "date_of_digest" ],
              },
              order: "date_of_digest",
            },
            {
              name: "progress_normal",
              rows: [
                "sample", 
                [ "patient", "::has", "date_of_digest" ],
                [ "sample_name", "::matches", '\.N.$' ],
              ],
              columns: {
                date_of_digest: [ "patient", "date_of_digest" ],
              },
              order: "date_of_digest",
            }
          ],
          lines: [
            {
              table: "progress_total",
              x: "date_of_digest",
              y: "::row_number",
              label: "total",
              color: "mediumseagreen"
            },
            {
              table: "progress_tumor",
              x: "date_of_digest",
              y: "::row_number",
              label: "tumor",
              color: "indigo"
            },
            {
              table: "progress_normal",
              x: "date_of_digest",
              y: "::row_number",
              label: "normal",
              color: "cornflowerblue"
            }
          ]
        )
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
