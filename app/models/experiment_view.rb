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
        data do |record|
          # Get all samples for this experiment
          samples = Sample.join(:patients, :id => :patient_id).where(patients__experiment_id: record.id).select_all(:samples).all
          metrics = Metrics.new(Sample)

          metrics.add_records samples

          metrics.to_hash
        end
      end
    end
  end
end
