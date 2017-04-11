class ExperimentView < TimurView
  tab :overview do
    pane :default do 
      shows :project, :description, :short_name, :patient
    end
  end

  tab :completion_metrics do
    pane :default do
      show :completion do
        attribute_class "MetricsAttribute"
        display_name "Completion"
        plot(
          name: "completion_metrics",
          manifest: [
            [
              :model_name, "'sample'"
            ],
            [  :metrics, "question([
                'sample', 
                [ 'patient', 'experiment', 'name', '::equals', @record_name ],
                '::all',
                '::metrics'
              ])",
            ]
          ]
        )
      end
    end
  end
end
