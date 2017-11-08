module Archimedes
  # A general grab-bag class for functions that don't merit their own
  # class
  class Default < Archimedes::Function
    def self.is_func? function_name
      method_defined?(function_name.to_sym)
    end

    def call
      self.send(@function_name.to_sym, *@args)
    end

    def length(vector)
      vector.length
    end

    def max(vector)
      vector.max
    end

    def min(vector)
      vector.min
    end

    def log(vector, base)
      vector.op {|v| Math.log(v,base) }
      Vector.new(vector.map{|k,v| [ k, Math.log(v, base) ]})
    end

  end
end
