module PlotHelper
  def compute_ratio nums, dens, opts={}
    nums = [ nums ].flatten
    dens = [ dens ].flatten

    num_sum = nums.inject(nil) do |sum, name|
      value = yield(name)
      if value
        sum ||= 0
        sum + value
      else
        sum
      end
    end

    if !num_sum 
      if opts[:discard_null]
        return nil
      else
        num_sum = 0
      end
    end

    den_sum = dens.inject(0) do |sum,name|
      sum + [ 1, yield(name) || 1 ].max
    end

    num_sum / den_sum.to_f
  end
end
