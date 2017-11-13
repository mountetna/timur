module Archimedes
  class RtemisFunctions < Archimedes::Function
    FUNCTIONS = [ :diff_exp, :pca, :center, :scale, :transpose, :sd ]

    def self.is_func? function_name
      FUNCTIONS.include?(function_name.to_sym)
    end

    def call
      Rtemis.instance.call(@function_name, *@args)
    end
  end
end
