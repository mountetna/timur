class InfixLexer < RLTK::Lexer
  rule(/\s/)
  rule(/#.*$/)

  rule(/\{(.*)\}/) { |t| [ :MACRO, t[1..-2] ] }
  rule(/[0-9]+\.?[0-9]*/) { |t| [ :NUM, t.to_f ] }
  rule(/[A-Za-z]\w*/) { |t| [ :IDENT, t ] }
  rule(/'(?:[^']|'')*'/) { |t| [ :STRING, t[1..-2].gsub(/''/, "'") ] }

  rule(/\^/) { :EXP }
  rule(/\//) { :DIV }
  rule(/\*/) { :MUL }
  rule(/\+/) { :ADD }
  rule(/\-/) { :SUB }
  rule(/>/) { :GT }
  rule(/>=/) { :GTE }
  rule(/</) { :LT }
  rule(/<=/) { :LTE }
  rule(/\%/) { :MOD }
  rule(/\@/) { :VAR }
  rule(/\|\|/) { :OR }
  rule(/&&/) { :AND }
  rule(/==/) { :EQ }
  rule(/\$/) { :DOLLAR }
  rule(/\?/) { :QUESTION }
  rule(/=\~/) { :MATCH }

  rule(/\)/) { :RPAREN }
  rule(/\(/) { :LPAREN }
  rule(/\]/) { :RBRACKET }
  rule(/\[/) { :LBRACKET }
  rule(/\,/) { :COMMA }
  rule(/\:/) { :COLON }
end

class InfixParser < RLTK::Parser

  left :QUESTION
  left :MOD

  left :GT, :GTE, :LT, :LTE, :EQ, :MATCH

  left :SUB, :ADD

  left :DIV, :MUL

  left :EXP

  left :DOLLAR
  left :VAR

  production(:e) do

    clause('NUM') { |n| n }
    clause('STRING') { |n| n }
    clause('list') { |l| l }

    clause('MACRO') { |m| Macro.new(m) }

    clause('VAR IDENT') { |v,i| vars[i] }
    clause('LPAREN .e RPAREN') { |e| e }
    clause('.e ADD .e') { |e0, e1| e0 + e1 }
    clause('.e EXP .e') { |e0, e1| e0 ** e1 }
    clause('.e SUB .e') { |e0, e1| e0 - e1 }
    clause('.e QUESTION .e COLON .e') { |e0, e1, e2| e0.is_a?(Vector) ? e0.ternary(e1,e2) : (e0 ? e1 : e2) }

    clause('.e LBRACKET .e RBRACKET') { |e0, e1| e0[e1] }

    clause('.e GT .e') { |e0, e1| e0 > e1 }
    clause('.e GTE .e') { |e0, e1| e0 >= e1 }
    clause('.e LT .e') { |e0, e1| e0 < e1 }
    clause('.e LTE .e') { |e0, e1| e0 <= e1 }

    clause('.e DOLLAR .IDENT') { |table, column| table[column] }
    clause('SUB .e') { |e| -e }
    clause('.e DIV .e') { |e0, e1| e0 / e1 }
    clause('.e MUL .e') { |e0, e1| e0 * e1 }
    clause('.e OR .e') { |e0, e1| e0 || e1 }
    clause('.e AND .e') { |e0, e1| e0 && e1 }
    clause('.e EQ .e') { |e0, e1| e0 == e1 }
    clause('.e MATCH .e') { |e0, e1| e0 =~ /#{e1}/ }

    clause('VAR .IDENT LPAREN .args RPAREN') { |i, args| macro(vars[i], args) }
    clause('.IDENT LPAREN .args RPAREN') { |ident, args| 

      # The user token, which was set much earlier in the auth cycle, gets
      # passed into our collection of 'timur functions'.
      func = TimurFunction.new(token, project_name, ident, args)
      func.call()
    }
  end

  production(:list) do
    clause('LBRACKET .list_args RBRACKET') { |args| Vector.new(args) }
  end

  production(:list_args) do
    clause('')         { || []       }
    clause('list_items') { |items| items }
  end

  production(:list_items) do
    clause('.list_item')                { |e| [e]                 }
    clause('.list_item COMMA .list_items') { |e, args| [e] + args }
  end

  production(:list_item) do
    clause('e') {|e| [ nil, e ] }
    clause('.IDENT COLON .e') {|i,e| [ i,e ]}
  end

  production(:args) do
    clause('')         { || []       }
    clause('arg_list') { |args| args }
  end

  production(:arg_list) do
    clause('e')                { |e| [e]                 }
    clause('e COMMA arg_list') { |e, _, args| [e] + args }
  end

  finalize

  class Environment < RLTK::Parser::Environment
    attr_accessor :token, :project_name, :vars

    class << self
      def create(token, project_name, vars)
        env = self.new
        env.token = token
        env.project_name = project_name
        env.vars = vars
        env
      end
    end

    def macro(mac, args)
      raise TypeError('Variable is not a macro') unless mac.is_a?(Macro)
      InfixParser::parse(InfixLexer::lex(mac.substitute(args)), {env: self})
    end
  end
end
