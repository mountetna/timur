class InfixLexer < RLTK::Lexer
  rule(/\s/)
  rule(/#.*$/)

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

  class Environment < RLTK::Parser::Environment
    def self.create vars
      env = self.new
      env.vars = vars
      env
    end
    attr_accessor :vars
  end

  production(:e) do
    clause('NUM') { |n| n }
    clause('STRING') { |n| n }
    clause('list') { |l| l }

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

    clause('.IDENT LPAREN .args RPAREN') { |ident, args| Functions.call(ident, args) }
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
end
