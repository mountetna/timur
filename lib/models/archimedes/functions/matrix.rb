module Archimedes
  # A general grab-bag class for functions that don't merit their own
  # class
  class MatrixFunctions < Archimedes::FunctionCollection
    def rowsums(matrix)
      return Archimedes::Vector.new(
        matrix.row_names.zip(
          matrix.rows.map do |row|
            row.to_values.inject(&:+)
          end
        )
      )
    end

    def colsums(matrix)
      return Archimedes::Vector.new(
        matrix.col_names.zip(
          matrix.col_names.map.with_index do |col_name,j|
            matrix.rows.map{|r| r[j]}.inject(&:+)
          end
        )
      )
    end

    def rownames(matrix)
      Archimedes::Vector.new(matrix.row_names.map{|l| [ nil, l ]})
    end

    def colnames(matrix)
      Archimedes::Vector.new(matrix.col_names.map{|l| [ nil, l ]})
    end

    def numrows(matrix)
      matrix.row_names.length
    end

    def numcols(matrix)
      matrix.col_names.length
    end

    def bind(dim, inputs)
      raise ArgumentError, 'inputs must be a vector' unless inputs.is_a?(Archimedes::Vector)
      use_rows = dim == 'rows'
      raise ArgumentError, "dim must be 'rows' or 'cols'" unless use_rows || dim == 'cols'
      # first, transform all inputs to rows, an array of arrays.
      input_rows = inputs.map do |label, input|
        case input
        when Vector
          {
            rows: use_rows ? [ input.to_values ] : input.to_values.map{|v| [ v ]},
            row_names: use_rows ? [ label ] : input.to_labels,
            col_names: use_rows ? input.to_labels : [ label ]
          }
        when Matrix
          input.to_hash[:matrix]
        else
          raise ArgumentError, "Cannot bind #{input} to a matrix"
        end
      end

      input_sizes = input_rows.map do |input|
        # here we want the size of the row or column
        use_rows ? input[:col_names].length : input[:row_names].length
      end

      raise ArgumentError, "Cannot bind unequal sizes!" unless input_sizes.uniq.length == 1

      combined_rows = input_rows.inject(nil) do |combined, input|
        if use_rows
          combined ? combined + input[:rows] : input[:rows]
        else
          combined ? combined.map.with_index{ |row, i| row + input[:rows][i] } : input[:rows]
        end
      end

      if use_rows
        row_names = input_rows.map{|input| input[:row_names]}.inject(&:+)
        col_names = input_rows.first[:col_names]
      else
        row_names = input_rows.first[:row_names]
        col_names = input_rows.map{|input| input[:col_names]}.inject(&:+)
      end

      Archimedes::Matrix.new(
        row_names,
        col_names,
        combined_rows.map do |row|
          Archimedes::Vector.new(col_names.zip(row))
        end
      )
    end
  end
end
