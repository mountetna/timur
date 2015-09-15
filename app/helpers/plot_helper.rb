module PlotHelper
  def compute_ratio v1, v2, opts={}
    compute_operation(:/, v1, v2, opts) do |name|
      yield name
    end
  end

  def compute_operation op, v1, v2, opts={}
    v1_names = [ v1 ].flatten
    v2_names = [ v2 ].flatten

    v1_values = v1_names.map do |name|
      yield name
    end

    v2_values = v2_names.map do |name|
      yield name
    end

    case op
    when :/
      v1_sum = v1_values.compact.reduce &:+
      v2_sum = v2_values.compact.reduce &:+
      return nil if opts[:discard_null] && !v1_sum
      v1_sum ||= 0
      v2_sum = [ 1, v2_sum || 1 ].max
      return v1_sum / v2_sum.to_f
    end
  end
end
