module Archimedes
  class Vector
    include Enumerable
    class << self
      # A public method that runs some code vector and non-vector alike
      def op(value, &block)
        if value.is_a?(Vector)
          value.op(&block)
        else
          block.call(value)
        end
      end

      # an interface for easily defining a mathematical operation
      def operation *symbols
        make_operation(symbols) do |value, symbol, other_value|
          filter_nan(value.send(symbol, other_value))
        end
      end
      alias_method :operations, :operation

      # an interface for easily defining a comparison operation
      def comparison *symbols
        make_operation(symbols) do |value, symbol, other_value|
          !!filter_nan(value.send(symbol, other_value))
        end
      end 
      alias_method :comparisons, :comparison

      private

      def make_operation(symbols)
        symbols.each do |symbol|
          define_method symbol do |other|
            op(other) do |value, other_value|
              yield(value, symbol, other_value)
            end
          end
        end
      end

      def filter_nan(value)
        (value.respond_to?(:nan?) && value.nan?) ? nil : value
      end
    end

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

    def -@
      op {|v| -v }
    end

    def !
      op {|v| !v }
    end

    comparisons :!=, :==, :>, :<, :=~, :>=, :<=

    operations :/, :+, :*, :-

    def concat other
      return self.class.new(to_a + other.to_a)
    end

    def length
      @vector.length
    end

    def max
      to_values.compact.max
    end

    def min
      to_values.compact.min
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

    def op *others
      # make sure your arguments are valid
      others.each do |other|
        if other.is_a?(Vector) && other.length != length
          raise ArgumentError, "Vector lengths do not match!"
        end
      end
      self.class.new(
        @vector.map.with_index do |(label, value), i|
          # operations on nil return nil.
          if value.nil? || others.any?{|other| other.is_a?(Vector) ? other[i].nil? : other.nil? }
            [ label, nil ]
          else
            [ label, yield(value, *others.map{|other| other.is_a?(Vector) ? other[i] : other }) ]
          end
        end
      )
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
  end

  class ColumnVector < Vector
    # this is merely to mark that this vector should be treated as a column
  end
end
