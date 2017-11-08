module Archimedes
  class Spread < Archimedes::Function

    ## spread example
      # INPUT data_table
      #   "col_names": ["tube", "hugo_name", "count"],
      #   "row_names": [1684349, 1686048, 1693757, 2439012, 2440711, 2448420, 3600032, 3601731, 3609440, 4006389, 4008088, 4015797 ],
      #   "rows": [
      #     ["IPIPDAC006.T1.rna.myeloid", "SNRPD3", 95],
      #     ["IPIPDAC006.T1.rna.myeloid", "VPS29", 1845],
      #     ["IPIPDAC006.T1.rna.myeloid", "VCP", 579],
      #     ["IPIPDAC006.T1.rna.tcell", "SNRPD3", 3],
      #     ["IPIPDAC006.T1.rna.tcell", "VPS29", 1897],
      #     ["IPIPDAC006.T1.rna.tcell", "VCP", 344],
      #     ["IPIPDAC006.T1.rna.live", "SNRPD3", 2],
      #     ["IPIPDAC006.T1.rna.live", "VPS29", 442],
      #     ["IPIPDAC006.T1.rna.live", "VCP", 201],
      #     ["IPIPDAC006.T1.rna.treg", "SNRPD3", 0],
      #     ["IPIPDAC006.T1.rna.treg", "VPS29", 0],
      #     ["IPIPDAC006.T1.rna.treg", "VCP", 0]
      #   ],
      #   "col_types": ["String", "String", "Numeric"]
      #
      # OUTPUT data_table
      #   "col_names": ["SNRPD3", "VPS29", "VCP"],
      #   "row_names": ["IPIPDAC006.T1.rna.myeloid", "IPIPDAC006.T1.rna.tcell", "IPIPDAC006.T1.rna.live", "IPIPDAC006.T1.rna.treg"],
      #   "rows": [
      #     [95, 1845, 579],
      #     [3, 1897, 344],
      #     [2, 442, 201],
      #     [0, 0, 0]
      #   ]
    ##

    def call
      matrix, *_ = @args

      # group rows by value in the first column
      rows_by_first_column_val = matrix.rows.group_by do |r|
        r.to_values[0]
      end

      # new columns are the values in the second column - key
      new_columns = matrix.rows.map do |r|
        r.to_values[1] 
      end.uniq

      # values to the new columns are in the third column - value
      new_rows = rows_by_first_column_val.map do |_, r|
        col_to_val_map = r.map{ |v| v.to_values[1, 2] }.to_h
        row = new_columns.map{ |c| [c, col_to_val_map[c]] }
        Vector.new(row)
      end

      Matrix.new(rows_by_first_column_val.keys, new_columns, new_rows, [])
    end
  end
end
