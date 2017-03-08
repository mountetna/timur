class InfixParser
  PRECEDENCE = {
    :^ => 3, 
    :/ => 3, 
    :* => 3,
    :+ => 2,
    :- => 2, 
    :% => 1,
    :")" => 0,
    :"(" => 0,
    :"," => 0,

  }

  OPERATOR_MATCH = /
    ^[#{
      PRECEDENCE.keys.map do |op|
        "\\#{op}"
      end.join('')
    }]
  /x

  NUMBER_MATCH = /
    ^
    \-?
    [0-9]+
    \.?[0-9]*
  /x

  WORD_MATCH = /^\w+/

  def initialize formula, vars
    @input = formula
    @formula = formula
    @vars = vars
    @stack = []
    @output = []
  end

  def value
    parse unless @formula.empty?
    @output
  end

  private

  def get_token
    return nil unless @formula && !@formula.empty?

    @formula = @formula.sub(/^\s+/,'')
    puts "Formula: #{@formula}"
    
    if !@check_negative
      @formula.match(OPERATOR_MATCH) do |match|
        make_term(match[0].length, :op)
        return true
      end
    end

    # you match a number
    @formula.match(NUMBER_MATCH) do |match|
      make_term(match[0].length, :number)
      @term = @term.to_f
      return true
    end

    # you match an operator
    @formula.match(OPERATOR_MATCH) do |match|
      make_term match[0].length, :op
      return true
    end

    # you match a string
    @formula.match(WORD_MATCH) do |match|
      word_size = match[0].length

      make_term(word_size, :func)
      return true
    end

    puts "#{@formula} matched nothing."
    return nil
  end

  def make_term size, type
    @term = @formula[0...size]
    @formula = @formula[size..-1]
    @term_type = type
  end

  def parse
    @check_negative = true

    return nil if !@formula || @formula.empty?

    until get_token.nil? do
      puts "Term: '#{@term}'"
      case @term_type
      when :number
        puts "number"
        handle_number
      when :func
        puts "func"
        handle_func
      when :op
        case @term
        when ','
          puts "comma"
          handle_func_sep
        when '('
          puts "open"
          handle_open
        when ')'
          puts "close"
          return nil unless handle_close
        else
          handle_operator
        end
      end

      print_stack
    end

    while !@stack.empty? do
      return nil if @stack.last == '('
      @output.push @stack.pop
    end

    return @output
  end

  def print_stack
      puts "Stack: [#{@stack.join(", ")}]"
      puts "Output: [#{@output.join ", "}]"
  end

  def handle_number
    @output.push @term
    @check_negative = false
  end

  def handle_open
    @stack.push @term
    @check_negative = true
  end

  def handle_close
    while !@stack.empty? && @stack.last != '(' do
      @output.push @stack.pop
      print_stack
    end
    @stack.pop
  end

  def handle_func
    @stack.push @term
    @check_negative = true

  def handle_operator
    while !@stack.empty?  && 
      @stack.last.match(OPERATOR_MATCH) && 
      PRECEDENCE[@stack.last.to_sym] >= PRECEDENCE[@term.to_sym] do
      @output.push @stack.pop
      print_stack
    end
    @stack.push @term
    @check_negative = true
  end
end
