class Metrics
  def initialize model
    @model = model
    @records = []
    @metrics = {}
  end

  def add_records records
    @records.concat records
    records.each do |record|
      @metrics[record] = model_metrics.map do |model_metric|
        model_metric.new(record)
      end
    end
  end

  def model_metrics
    @model_metrics ||= 
      begin
        container = find_metrics_class @model

        return [] unless container

        container.constants.map do |const|
          metrics_class = container.const_get(const)
          metrics_class if metrics_class < TimurMetric
        end.compact
      end
  end

  def find_metrics_class model
    container_name = "#{model.name}Metrics".to_sym
    begin
      Kernel.const_get container_name
    rescue NameError => e
      raise e unless e.message =~ /uninitialized constant/
      TimurView
    end
  end

  def collected_categories
    Hash[
      model_metrics.group_by(&:category).map do |category,model_metrics|
        [ category, model_metrics.map(&:metric_name) ]
      end
    ]
  end

  def to_hash
    {
      categories: collected_categories,
      model_name: @model.model_name,
      metrics: Hash[
        @metrics.map do |record, metrics|
          [ record.identifier, grouped_by_category(metrics) ]
        end
      ]
    }
  end

  def grouped_by_category metrics
    Hash[
      metrics.group_by(&:category).map do |category,metrics|
        [ category, metrics.map(&:to_hash) ]
      end
    ]
  end
end
