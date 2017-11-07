class Vector
  include Enumerable
  def initialize list_items
    @vector = list_items || []
  end

  def each
    @vector.each do |label, value|
      yield label, value
    end
  end

  def [] idx
    if idx.is_a?(Numeric)
      @vector[idx][1]
    else
      label_index[idx] ?  @vector[ label_index[idx] ][1] : nil
    end
  end

  def ternary other1, other2
    op(other1,other2) do |value, other_value1, other_value2|
      value ? other_value1 : other_value2
    end
  end

  def == other
    op(other) do |value, other_value|
      value == other_value
    end
  end

  def > other
    op(other) do |value, other_value|
      value > other_value
    end
  end

  def < other
    op(other) do |value, other_value|
      value < other_value
    end
  end

  def =~ other
    op(other) do |value, other_value|
      value =~ other_value ? true : false
    end
  end

  def >= other
    op(other) do |value, other_value|
      value >= other_value
    end
  end

  def <= other
    op(other) do |value, other_value|
      value <= other_value
    end
  end

  def / other
    op(other) do |value, other_value|
      value.to_f / other_value
    end
  end

  def + other
    op(other) do |value, other_value|
      value.to_f + other_value
    end
  end

  def * other
    op(other) do |value, other_value|
      value.to_f * other_value
    end
  end

  def - other
    op(other) do |value, other_value|
      value.to_f - other_value
    end
  end

  def length
    @vector.length
  end

  def max
    to_values.compact.max
  end

  def payload
    {
      vector: @vector.map do |label, value|
        { 
          label: label, 
          value: value.respond_to?(:payload) ? value.payload : value
        }
      end
    }
  end

  def to_values
    @vector.map do |label, value|
      value.is_a?(Vector) ? value.to_values : value
    end
  end

  def to_labels
    @labels ||= @vector.map &:first
  end

  private

  def label_index
    @label_index ||= Hash[
      @vector.each_index.reject do |i| 
        @vector[i].first.nil?
      end.map do |i|
        [ @vector[i].first, i ]
      end
    ]
  end

  def op *others
    others.each do |other|
      raise ArgumentError, "Vector lengths do not match!" if other.is_a?(Vector) && other.length != length
    end
    Vector.new(
      @vector.map.with_index do |(label, value), i|
        if value.nil? || others.any?{|other| other.is_a?(Vector) ? other[i].nil? : other.nil? }
          [ label, nil ]
        else
          [ label, yield(value, *others.map{|other| other.is_a?(Vector) ? other[i] : other }) ]
        end
      end
    )
  end
end
