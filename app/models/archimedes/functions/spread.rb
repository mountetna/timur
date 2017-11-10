module Archimedes
  # given an input matrix with columns name1, name2, value,
  # returns a matrix with column names $name1, row names $name2
  # and values $value
  # Useful because many methods operate on a counts matrix
  class Spread < Archimedes::Function
    def call
      matrix, *_ = @args

      # row names are in the first column
      row_names = matrix.rows.map {|r| r[0] }.uniq

      # col names are in the second column
      col_names = matrix.rows.map { |r| r[1] }.uniq

      # group rows by value in the first column
      row_groups = matrix.rows.group_by do |r|
        r[0]
      end

      # values to the new columns are in the third column - value
      new_rows = row_groups.map do |row_name, values|
        columns = values.map { |v| [ v[1], v[2] ] }.to_h
        Vector.new( col_names.map{ |c| [c, columns[c]] } )
      end

      Matrix.new(
        row_names,
        col_names,
        new_rows
      )
    end
  end
end
