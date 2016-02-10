class Mapping
  attr_reader :key, :name
  def initialize key, params
    @key = key
    @type = params[:type]
    @name = params[:name]

    @params = params

    create_mapper
  end

  def get_value sample, pops
    @mapper.get_value(sample, pops)
  end

  private
  def create_mapper
    case @type
    when "Population Fraction"
      @mapper = PopulationFractionMapper.new @params
    when "MFI"
      @mapper = MfiMapper.new @params
    end
  end
end

class Mapper
  def has_parent? p, parent_name
    !parent_name || p.ancestry =~ /^#{Regexp.escape(parent_name)}/
  end
end

class MfiMapper < Mapper
  def initialize params
    @stain = params[:stain]
    @name, @ancestor = params[:population].split(/##/)
    @channel = params[:mfi]
  end

  def get_value sample, pops
    pop = pops.find do |p|
      p.sample_id == sample.id &&
        p.stain == @stain &&
        p.name == @name &&
        has_parent?(p, @ancestor)
    end

    if pop
      Mfi.where(population_id: pop.id)
        .where(fluor: @channel)
        .select_map(:value).first
    end
  end
end

class PopulationFractionMapper < Mapper
  # This is a small class to extract the oogity concoction that is
  # currently used to input a ratio between cell counts for two
  # gated populations
  def initialize params
    @stain = params[:stain]
    @population1, @ancestor1 = params[:v1].split(/##/)
    @population2, @ancestor2 = params[:v2].split(/##/)
  end

  def get_value sample, pops
    v1 = sample_count( sample, @stain, @population1, @ancestor1, pops)
    v2 = sample_count( sample, @stain, @population2, @ancestor2, pops)

    return nil unless v1 && v2 && v2 != 0

    v1 / v2.to_f
  end

  private
  
  def sample_count(sample, stain, name, parent_name, pops)
    sample_pop = pops.find do |pop|
      pop.sample_id == sample.id && 
        pop.name == name && 
        pop.stain == stain.to_s && 
        has_parent?(pop,parent_name)
    end

    sample_pop ? sample_pop.count : nil
  end
end
