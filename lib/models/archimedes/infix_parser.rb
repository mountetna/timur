module Archimedes
  class InfixParser < RLTK::Parser
    left :QUESTION
    left :MOD

    left :GT, :GTE, :LT, :LTE, :EQ, :MATCH
    left :SUB, :ADD
    left :DIV, :MUL
    left :EXP

    left :DOLLAR
    left :VAR

    production(:script) do
      clause('assignment') { |a| [a] }
      clause('assignment script') { |a,script| [a] + script }
    end

    production(:assignment) do
      # An assignment
      clause('VAR .IDENT ASSIGN .e') do |i,e|
        @variable = i
        @vars[i] = e
      end
    end

    production(:e) do

      # these are the basic types
      clause('NUM') { |n| n }
      clause('STRING') { |s| s }
      clause('vector') { |v| v }

      # A macro definition, in the form of a template string, e.g. "{'time', %1, %2}"
      clause('MACRO') { |m| Archimedes::Macro.new(m) }

      # A variable reference
      clause('VAR IDENT') { |v,i| @vars[i] }


      clause('EXC .e') { |e| !e }

      # Basic math operations, including the ternary operator
      clause('LPAREN .e RPAREN') { |e| e }
      clause('.e ADD .e') { |e0, e1| e0 + e1 }
      clause('.e EXP .e') { |e0, e1| e0 ** e1 }
      clause('.e SUB .e') { |e0, e1| e0 - e1 }
      clause('.e QUESTION .e COLON .e') { |e0, e1, e2| e0.is_a?(Vector) ? e0.ternary(e1,e2) : (e0 ? e1 : e2) }

      # indexing, used by Vectors and Matrices
      clause('.e LBRACKET .e RBRACKET') { |e0, e1| e0[e1] }

      # matrix slicing
      clause('.e LBRACKET .slice COMMA .slice RBRACKET') { |matrix, rows, cols| matrix.slice(rows, cols) }

      # Comparison operators
      clause('.e GT .e') { |e0, e1| e0 > e1 }
      clause('.e GTE .e') { |e0, e1| e0 >= e1 }
      clause('.e LT .e') { |e0, e1| e0 < e1 }
      clause('.e LTE .e') { |e0, e1| e0 <= e1 }

      # Matrix column reference notation
      clause('.e DOLLAR .IDENT') { |table, column| table[column] }

      # Arithmetic operations
      clause('SUB .e') { |e| -e }
      clause('.e DIV .e') { |e0, e1| e0 / e1 }
      clause('.e MUL .e') { |e0, e1| e0 * e1 }
      clause('.e OR .e') { |e0, e1| e0 || e1 }
      clause('.e AND .e') { |e0, e1| e0 && e1 }
      clause('.e EQ .e') { |e0, e1| e0 == e1 }
      clause('.e NEQ .e') { |e0, e1| e0 != e1 }
      clause('.e MATCH .e') { |e0, e1| e0 =~ /#{e1}/ }

      # Macro dereferencing
      clause('VAR .IDENT LPAREN .args RPAREN') { |i, args| macro(i, args) }

      # Function calling
      clause('.IDENT LPAREN .args RPAREN') { |ident, args| 
        # User token and project_name are required if the function needs to
        # call Magma
        Archimedes::Function.call(@token, @project_name, ident, args)
      }
    end

    production(:vector) do
      clause('LBRACKET .vector_args RBRACKET') { |args| Vector.new(args) }
    end

    production(:vector_args) do
      clause('')         { [] }
      clause('vector_items') { |items| items }
    end

    production(:vector_items) do
      clause('.vector_item')                { |e| [e]                 }
      clause('.vector_item COMMA .vector_items') { |e, args| [e] + args }
    end

    production(:vector_item) do
      clause('e') {|e| [ nil, e ] }
      clause('.IDENT COLON .e') {|i,e| [ i,e ]}
      clause('.STRING COLON .e') {|s,e| [ s,e ]}
    end

    production(:args) do
      clause('')         { || []       }
      clause('arg_list') { |args| args }
    end

    production(:arg_list) do
      clause('e')                { |e| [e]                 }
      clause('e COMMA arg_list') { |e, _, args| [e] + args }
    end

    production(:slice) do
      clause('e')                { |e| e }
      clause('')                { nil }
    end

    finalize
  end
end
