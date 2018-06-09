module Archimedes
  class InfixLexer < RLTK::Lexer
    rule(/\s/)
    rule(/#.*$/)

    rule(/\{(.*)\}/m) { |t| [ :MACRO, t[1..-2] ] }
    rule(/[0-9]+\.?[0-9]*/) { |t| [ :NUM, t.to_f ] }
    rule(/[A-Za-z][\.\w]*/) { |t| [ :IDENT, t ] }
    rule(/'(?:[^']|'')*'/) { |t| [ :STRING, t[1..-2].gsub(/''/, "'") ] }

    rule(/\^/) { :EXP }
    rule(/\//) { :DIV }
    rule(/\*/) { :MUL }
    rule(/\+/) { :ADD }
    rule(/\-/) { :SUB }
    rule(/=/) { :ASSIGN }
    rule(/>/) { :GT }
    rule(/>=/) { :GTE }
    rule(/</) { :LT }
    rule(/<=/) { :LTE }
    rule(/\%/) { :MOD }
    rule(/\@/) { :VAR }
    rule(/\|\|/) { :OR }
    rule(/&&/) { :AND }
    rule(/==/) { :EQ }
    rule(/!=/) { :NEQ }
    rule(/\$/) { :DOLLAR }
    rule(/\?/) { :QUESTION }
    rule(/=\~/) { :MATCH }
    rule(/!/) { :EXC }

    rule(/\)/) { :RPAREN }
    rule(/\(/) { :LPAREN }
    rule(/\]/) { :RBRACKET }
    rule(/\[/) { :LBRACKET }
    rule(/\,/) { :COMMA }
    rule(/\:/) { :COLON }
  end
end
