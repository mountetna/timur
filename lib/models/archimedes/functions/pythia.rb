module Archimedes
  class PythiaFunctions < Archimedes::Function
    FUNCTIONS = [ :add]

    def self.is_func? function_name
      FUNCTIONS.include?(function_name.to_sym)
    end

    def call
      Pythia.instance.call(@function_name, *@args)
    end
  end
end
