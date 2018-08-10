module Archimedes
  # A general grab-bag class for functions that don't merit their own
  # class
  class VectorFunctions < Archimedes::FunctionCollection
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

    def any(vector)
      vector.any? { |label, value| value }
    end

    def all(vector)
      vector.all? { |label, value| value }
    end

    def column(vector)
      vector.is_a?(ColumnVector) ? vector : ColumnVector.new(vector.to_a)
    end

    def row(vector)
      vector.is_a?(ColumnVector) ? Vector.new(vector.to_a) : vector
    end

    def label(vector, labels)
      Vector.new(labels.to_values.zip(vector.to_values))
    end

    def labels(vector)
      Vector.new(vector.map {|l,v| [ nil, l ]})
    end

    def rep(vector,times)
      labels = vector.to_labels
      values = vector.to_values
      Vector.new((labels*times).zip(values*times))
    end

    def join(vector,sep="")
      vector.to_values.join(sep)
    end

    def seq(start,stop,interval=1)
      Vector.new((start..stop).step(interval).map{|i| [nil,i]})
    end

    def concat(*vectors)
      vectors.reduce do |summ, vec|
        summ = summ ? summ.concat(vec) : vec
      end
    end

    def log(value, base=Math::E)
      if value.is_a?(Archimedes::Matrix)
        Rtemis.instance.call(:log, value, base)
      else
        Vector.op(value) {|v| Math.log(v,base) }
      end
    end
  end
end
