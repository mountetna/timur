class Series
  attr_reader :key, :name
  def initialize key, params
    # Right now, a series is a set of samples and
    # can partition based on 
    # sample => patient => experiment.name
    # and
    # sample => patient => clinicals => parameters.[name, value]

    @key = key
    @name = params[:name]

    @experiment = get_experiment params[:indication]
    @clinical_value = params[:clinical_value]
    @clinical_name = params[:clinical_name]
  end

  def samples
    @samples ||=
      begin
        samples = Sample.graph(:patients, id: :patient_id)
        if @experiment
          samples = samples.where(patients__experiment_id: @experiment.id)
        end
        if @clinical_value
          samples = samples.graph(:clinicals, clinicals__id: :patients__clinical_id)
            .graph(:parameters, clinicals__id: :parameters__clinical_id)
            .where(parameters__name: @clinical_name)
            .where(parameters__value: @clinical_value)
        end
        samples.order.all
      end
  end

  def map_by mapping
    samples.map do |sample|
      mapping.get_value sample, cached_populations
    end
  end

  private
  def get_experiment name
    Experiment[name: name ] unless name == "Any"
  end

  def cached_populations
    @cached_populations ||= Population.where(sample_id: samples.map(&:id)).all
  end
end
