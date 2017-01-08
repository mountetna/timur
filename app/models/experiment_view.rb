class ExperimentView < TimurView
  tab :overview do
    pane :default do 
      shows :project, :description, :short_name, :patient
    end
  end

  tab :completion_metrics do
    pane :default do
      adds :completion do
        attribute_class "MetricsAttribute"
        display_name "Completion"
        data(
          query: {
            rows: [ "sample", [ "patient", "experiment", "name", "::equals", "@record_name" ] ],
            columns: {
              sample_name: [ "sample_name" ],
              metrics: [ "::metrics" ]
            }
          }
        )
      end
    end
  end
end
