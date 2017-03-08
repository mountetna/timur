class ProjectView < TimurView
  tab :overview do
    pane :default do 
      show :description
      show :qc do
        attribute_class "BoxPlotAttribute"
        display_name "Immune fractions (CD45+ / live)"
        plot(
          name: "project_qc",
          manifest: {
            immune_fraction_by_sample: {
              type: "table",
              value: {
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
              }
            },
            category: {
              type: "formula",
              value: "@immune_fraction_by_sample.experiment_name",
            },
            height: {
              type: "formula",
              value: "@immune_fraction_by_sample.cd45_count / @immune_fraction_by_sample.live_count"
            }
          }
        )
      end

      show :progress_plot do |att|
        attribute_class "LinePlotAttribute"
        display_name "Progress"
        plot(
          name: "project_progress",
          manifest: {
            progress_total: {
              type: "table",
              value: {
                rows: [ "sample", [ "patient", "::has", "date_of_digest" ] ],
                columns: {
                  date_of_digest: [ "patient", "date_of_digest" ],
                },
                order: "date_of_digest",
              }
            },
            progress_tumor: {
              type: "table",
              value: {
                rows: [
                  "sample", 
                  [ "patient", "::has", "date_of_digest" ],
                  [ "sample_name", "::matches", '\.T.$' ],
                ],
                columns: {
                  date_of_digest: [ "patient", "date_of_digest" ],
                },
                order: "date_of_digest",
              }
            },
            progress_normal: {
              type: "table",
              value: {
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
            },
            x: {
              type: "list",
              value: [
                "progess_total$date_of_digest",
                "progess_tumor$date_of_digest",
                "progess_normal$date_of_digest",
              ],
              labels: [
                "'total'",
                "'tumor'",
                "'normal'"
              ]
            },
            y: {
              type: "list",
              value: [
                "progess_total$row_number + 1",
                "progess_tumor$row_number + 1",
                "progess_normal$row_number + 1",
              ]
            },
            ylabel: "sample count"
          }
        )
      end
      show :whats_new do
        attribute_class "MarkdownAttribute"
      end
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
      shows :faq do
        attribute_class "MarkdownAttribute"
      end
    end
  end
end
