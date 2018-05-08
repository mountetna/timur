module Archimedes
  class Matrix
    attr_reader :row_names, :col_names, :rows

    def initialize row_names, col_names, rows
      @row_names = row_names
      @col_names = col_names
      @rows = rows
      @columns = {}
    end

    def dim
      [ col_names.length, row_names.length ]
    end

    # Construct a Matrix from a JSON object with format { rows, row_names, col_names }
    def self.from_matrix(matrix)
      rows = matrix["rows"].map do |row|
        Vector.new(matrix["col_names"].zip(row))
      end
      self.new(matrix["row_names"], matrix["col_names"], rows)
    end

    class << self
      def operation *symbols
        symbols.each do |symbol|
          define_method symbol do |other|
            case other
            when Matrix
              raise ArgumentError, "Unequal matrix sizes!" unless other.dim == self.dim
              return Matrix.new(
                row_names,
                col_names,
                rows.map.with_index do |row,i|
                  row.send(symbol, other.rows[i])
                end
              )
            when ColumnVector
              raise ArgumentError, "Unequal sizes!" unless other.length == self.dim[1]
              return Matrix.new(
                row_names,
                col_names,
                rows.map.with_index do |row,i|
                  row.send(symbol, other[i])
                end
              )
            when Vector
              raise ArgumentError, "Unequal sizes!" unless other.length == self.dim[0]
              return Matrix.new(
                row_names,
                col_names,
                rows.map.with_index do |row,i|
                  row.send(symbol, other)
                end
              )
            when Numeric
              return Matrix.new(
                row_names,
                col_names,
                rows.map do |row|
                  row.send(symbol, other)
                end
              )
            end
          end
        end
      end
      alias_method :operations, :operation
    end

    def [] column_name
      return column(column_name)
    end

    def payload
      to_hash
    end

    def slice row_set, col_set
      raise ArgumentError, 'Rows and columns must be integer vectors!' if !valid_slice?(row_set) || !valid_slice?(col_set)

      row_set = row_set.to_values if row_set
      col_set = col_set.to_values if col_set

      new_row_names = row_set ? row_names.values_at(*row_set) : row_names
      new_col_names = col_set ? col_names.values_at(*col_set) : col_names

      new_rows = (row_set ? rows.values_at(*row_set) : rows).map do |row|
        Vector.new(
          new_col_names.zip(col_set ?  row.to_values.values_at(*col_set) : row.to_values)
        )
      end

      return Matrix.new(
        new_row_names,
        new_col_names,
        new_rows
      )
    end

    private

    def valid_slice? set
      set.nil? || set.is_a?(Vector) && set.all?{|_,v| v.is_a?(Numeric)}
    end

    public

    def -@
      return Matrix.new(
        row_names,
        col_names,
        rows.map { |row| -row }
      )
    end

    operation :*, :/, :+, :-


    def to_hash
      {
        matrix: {
          col_names: @col_names,
          row_names: @row_names,
          rows: @rows.map(&:to_values)
        }
      }
    end

    def column column_name
      return @columns[column_name] if @columns[column_name]

      @columns[column_name] = Vector.new(
        @row_names.zip(
          case column_name
          when "row_name"
            @row_names
          when "row_number"
            (0...@rows.size).to_a
          else
            @rows.map do |row|
              row[column_name]
            end
          end
        )
      )
    end
  end
end
