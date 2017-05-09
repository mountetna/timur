class ProjectView < TimurView
  tab :overview do
    pane :default do 
      show :description
      show :qc do
        attribute_class "BoxPlotAttribute"
        display_name "Immune fractions (CD45+ / live)"
        plot(
          name: "project_qc",
          manifest: [
            [ :immune_fraction_by_sample, <<-EOT
              table(
                [ 'sample', [ 'patient', '::has', 'experiment' ] ],
                [
                  sample_name: [ 'sample_name' ],
                  experiment_name: [ 'patient', 'experiment', 'name' ],
                  cd45_count: [ 'population', 
                                [ 'name', '::equals', 'CD45+' ],
                                [ 'stain', '::equals', 'sort' ],
                                '::first', 'count' ],
                  live_count: [ 'population', 
                                [ 'name', '::equals', 'Live' ],
                                [ 'stain', '::equals', 'sort' ],
                                '::first', 'count' ]
                ]
              )
              EOT
              ],
            [ :category, "@immune_fraction_by_sample$experiment_name" ],
            [ :height, "@immune_fraction_by_sample$cd45_count / @immune_fraction_by_sample$live_count" ]
          ]
        )
      end

      show :progress_plot do |att|
        attribute_class "LinePlotAttribute"
        display_name "Progress"
        plot(
          name: "project_progress",
          manifest: [
            [ :progress_total, "table(
                [ 'sample', [ 'patient', '::has', 'date_of_digest' ] ],
                [
                  date_of_digest: [ 'patient', 'date_of_digest' ]
                ],
                [ order: 'date_of_digest' ]
              )" ],
            [ :progress_tumor, 
              "table( 
                [ 'sample', 
                  [ 'patient', '::has', 'date_of_digest' ],
                  [ 'sample_name', '::matches', '\.T.$' ]
                ],
                [
                  date_of_digest: [ 'patient', 'date_of_digest' ]
                ],
                [ order: 'date_of_digest' ]
                )"
            ],
            [ :progress_normal, "table(
                [ 'sample', 
                  [ 'patient', '::has', 'date_of_digest' ],
                  [ 'sample_name', '::matches', '\.N.$' ]
                ],
                [ date_of_digest: [ 'patient', 'date_of_digest' ] ],
                [ order: 'date_of_digest' ]
                )" ],
            [ :lines, "[
                total: [
                  x: @progress_total$date_of_digest,
                  y: @progress_total$row_number + 1
                ],
                tumor: [
                  x: @progress_tumor$date_of_digest,
                  y: @progress_total$row_number + 1
                ],
                normal: [
                  x: @progress_normal$date_of_digest,
                  y: @progress_total$row_number + 1
                ]
              ]" ],
            [ :ylabel, "'sample count'" ]
          ]
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

  tab :sequencing do
    pane :default do
      shows :rna_seq_plate
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
