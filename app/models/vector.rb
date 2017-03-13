class Vector
  include Enumerable
  def initialize list_items
    @vector = list_items
  end

  def each
    @vector.each do |label, value|
      yield value, label
    end
  end

  def [] idx
    if idx.is_a?(Fixnum)
      @vector[idx][1]
    else
      @vector[
        label_index[idx]
      ][1]
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

  def to_a
    @vector.map do |label, value|
      value.is_a?(Vector) ? value.to_a : value
    end
  end

  def labels
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

  def op other
    case other
    when Vector
      raise ArgumentError, "Vector lengths do not match!" unless other.length == length
      Vector.new(
        @vector.map.with_index do |(label, value), i|
          if value.nil? || other[i].nil?
            [ label, nil ]
          else
            [ label, yield(value, other[i]) ]
          end
        end
      )
    when Numeric
      Vector.new(
        @vector.map do |label, value|
          if value.nil?
            [ label, nil ]
          else
            [ label, yield(value, other) ]
          end
        end
      )
    end
  end

end
