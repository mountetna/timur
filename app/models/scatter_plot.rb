class ScatterPlot
  VARIABLES = [
    "CD4-CD8-/CD3 all" ,
    "CD14+ TAM/CD45+",
    "BDCA3+/HLADR+",
    "CD4+CD8+/CD3 all",
    "Tr/Th"
  ]

  def initialize params
    @x_var = params[:x_var]
    @y_var = params[:y_var]
    @indication = Experiment[name: params[:indication] ]
  end

  def compute_ratio nums, dens, opts={}
    nums = [ nums ].flatten
    dens = [ dens ].flatten

    num_sum = nums.inject(nil) do |sum, name|
      value = yield(name)
      if value
        sum ||= 0
        sum + value
      else
        sum
      end
    end

    if !num_sum 
      if opts[:discard_null]
        return nil
      else
        num_sum = 0
      end
    end

    den_sum = dens.inject(0) do |sum,name|
      sum + [ 1, yield(name) || 1 ].max
    end

    num_sum / den_sum.to_f
  end

  def sample_count(populations, sid, stain, name)
    name, parent_name = name.split(/##/)
    populations.select do |p|
      p.sample_id == sid && 
        p.stain =~ /#{stain}$/ && 
        p.name == name && 
        (!parent_name || 
         (p.population && has_parent?(p,parent_name)))
    end.map(&:count).first
  end

  def has_parent? p, name
    populations.find do |pop|
      pop.id == p.population_id && pop.population.name == name
    end
  end

  def samples
    @samples ||= get_samples
  end

  def get_samples
    samples = Sample.join(:patients, :id => :patient_id)
    samples = samples.where(:experiment_id => @indication.id) if @indication
    samples.select_hash(:samples__id, :samples__sample_name)
  end

  def populations
    @populations ||= Population.where(sample_id: samples.keys).all
  end

  def get_variable var, sample_id
    case var
    when "CD4-CD8-/CD3 all"
      compute_ratio "Q4: CD8a- , CD4-##CD3+ all", "CD3+ all" do |name|
        sample_count(populations, sample_id, :treg, name)
      end
    when "CD14+ TAM/CD45+"
      compute_ratio "CD14+ TAMs", "CD45+" do |name|
        sample_count(populations, sample_id, :dc, name)
      end
    when "BDCA3+/HLADR+"
      compute_ratio "BDCA3+ DCs", "HLADR+" do |name|
        sample_count(populations, sample_id, :dc, name)
      end
    when "CD4+CD8+/CD3 all"
      compute_ratio "Q2: CD8a+ , CD4+##CD3+ all", "CD3+ all" do |name|
        sample_count(populations, sample_id, :treg, name)
      end
    when "Tr/Th"
      compute_ratio "CD3 all, CD4+, CD25+, FoxP3+ (Tr)", "CD3 all, CD4+, CD25- (Th)" do |name|
        sample_count(populations, sample_id, :treg, name)
      end
    end
  end

  def to_json
    # you should return an array of objects with name, x/y pairs, and colors
    {
      plot: {
          name: 'scatter',
          width: 800,
          height: 350,
          margin: { top: 10, right: 150, bottom: 150, left: 150},
      },
      xlabel: @x_var,
      ylabel: @y_var,
      data: samples.map do |sample_id, sample_name|
        value = {
          name: sample_name,
          x: get_variable( @x_var, sample_id ),
          y: get_variable( @y_var, sample_id )
        }
        value if value[:x] && value[:y]
      end.compact
    }
  end
end
