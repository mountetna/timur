class InfixLexer < RLTK::Lexer
  rule(/\s/)

  rule(/[0-9]+\.?[0-9]*/) { |t| [ :NUM, t.to_f ] }
  rule(/[A-Za-z]\w*/) { |t| [ :IDENT, t ] }
  rule(/'[^\']*?'/) { |t| [ :STRING, t[1..-2] ] }

  rule(/\^/) { :EXP }
  rule(/\//) { :DIV }
  rule(/\*/) { :MUL }
  rule(/\+/) { :ADD }
  rule(/\-/) { :SUB }
  rule(/\%/) { :MOD }
  rule(/\@/) { :VAR }
  rule(/\$/) { :DOLLAR }

  rule(/\)/) { :RPAREN }
  rule(/\(/) { :LPAREN }
  rule(/\]/) { :RBRACKET }
  rule(/\[/) { :LBRACKET }
  rule(/\,/) { :COMMA }
  rule(/\:/) { :COLON }
end

class InfixParser < RLTK::Parser
  left :MOD

  left :SUB
  right :ADD

  left :DIV
  right :MUL

  right :EXP

  right :DOLLAR
  right :VAR

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
    clause('.e DOLLAR .IDENT') { |table, column| table[column] }
    clause('SUB .e') { |e| -e }
    clause('.e DIV .e') { |e0, e1| e0 / e1 }
    clause('.e MUL .e') { |e0, e1| e0 * e1 }

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
