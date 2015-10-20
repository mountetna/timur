module PopulationHelper
  def sample_count(populations, sid, stain, name)
    name, parent_name = name.split(/##/)
    populations.select do |p|
      p.sample_id == sid && 
        p.stain =~ /#{stain}$/ && 
        p.name == name && 
        (!parent_name || has_parent?(p,parent_name))
    end.map(&:count).first
  end
  
  def has_parent? p, parent_name
    Rails.logger.info "#{p.ancestry} =? #{parent_name}"
    p.ancestry =~ /^#{Regexp.escape(parent_name)}/
  end

  def populations
    @populations ||= Population.where(sample_id: sample_id_hash.keys).all
  end

  def mfis
    @mfis ||= Mfi.where(population_id: populations.map(&:id))
  end

  def mfi_value sid, stain, name, mfi
    name, parent_name = name.split(/##/)
    pop = populations.find do |p|
      p.sample_id == sid && 
        p.stain =~ /#{stain}$/ && 
        p.name == name && 
        (!parent_name || has_parent?(p,parent_name))
    end
    if pop
      mfis.select do |m|
        m.fluor == "mfi" && m.population_id == pop.id
      end.map(&:value).first
    end
  end

  def sample_id_hash
    @sample_id_hash ||= begin
      samples = Sample.join(:patients, :id => :patient_id)
      samples = samples.where(:experiment_id => @indication.id) if @indication
      samples.select_hash(:samples__id, :samples__sample_name)
    end
  end
  
  def get_ratio stain, num, den
    compute_ratio num, den do |name|
      sample_count(record.population, record.id, stain, name)
    end
  end
  
  def get_dots(stain, num, den)
    sample_id_hash.map do |sample_id, sample_name|
      next if sample_id == @record.id
      ratio = compute_ratio(num, den, discard_null: true) do |name|
        sample_count populations, sample_id, stain, name
      end
      if ratio
        {
          name: sample_name,
          height: ratio
        }
      end
    end.compact
  end
end
