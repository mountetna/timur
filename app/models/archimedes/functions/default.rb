module Archimedes
  # A general grab-bag class for functions that don't merit their own
  # class
  class Default < Archimedes::FunctionCollection
    def length(vector)
      vector.length
    end

    def max(vector)
      vector.max
    end

    def min(vector)
      vector.min
    end

    def which(vector)
      Vector.new(vector.map.with_index do |(label,value), i|
        [ label, value ? i : nil ]
      end.select do |label, value| 
        value 
      end)
    end

    def order(vector, dir='asc')
      # the index-ordering of the given vector
      ordered = vector.to_values.map.with_index do |v,i|
        [ v, i ]
      end.sort_by(&:first)
      Vector.new(
        dir == 'asc' ? ordered : ordered.reverse
      )
    end

    def column(vector)
      vector.is_a?(ColumnVector) ? vector : ColumnVector.new(vector.to_a)
    end

    def row(vector)
      vector.is_a?(ColumnVector) ? Vector.new(vector.to_a) : vector
    end

    def log(value, base=nil)
      Vector.op(value) {|v| Math.log(v,base) }
    end
  end
end
