class Macro
  def initialize template
    @template = template
  end

  def substitute args
    args.each.with_index.inject(@template) do |output, (arg, i)|
      Rails.logger.info "#{arg} is a #{arg.class}"
      raise "Macro arguments must be Strings!" unless arg.is_a?(String)
      output.gsub(/\%#{i+1}/, %Q{ '#{arg}'})
    end
  end
end
