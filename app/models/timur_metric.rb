class TimurMetric
  def initialize record
    @record = record
    @message = "Test failed"
  end

  class << self
    def category category=:default
      @category ||= category
    end

    def metric_name
      name.split(/::/).last.snake_case.to_sym
    end
  end

  def category
    self.class.category
  end

  def metric_name
    self.class.metric_name
  end

  def to_hash
    { name: metric_name, score: test ? 1 : 0, message: @message }
  end

  def test
    nil
  end
end
