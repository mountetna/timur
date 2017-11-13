module Archimedes
  class DiffExp < Archimedes::Function
    def call
      matrix, p_value, group_one, group_two = @args

      Rtemis.instance.call(:diff_exp, matrix, p_value, group_one, group_two)
    end
  end
end
