def recursive_parse result, &block
  case result
  when Array
    block.call(result.map{ |item| recursive_parse(item, &block)})
  when Hash
    block.call(Hash[result.map{ |key,item| [ key, recursive_parse(item, &block)] }])
  else
    block.call(result)
  end
end

module Functions
  def self.call function, args
    if Functions.respond_to? function
      Functions.send function.to_sym, *args
    end
  end

  def self.question(query)
    status, payload = Magma::Client.instance.query(
      query.to_values
    )
    query_answer = JSON.parse(payload)
    recursive_parse(query_answer["answer"]) do |item|
      case item
      when /^(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/
        DateTime.parse(item)
      when Array
        item.all?{|v| v.is_a?(Array) && v.length == 2} ? Vector.new(item) : item
      else
        item
      end
    end
  end

  def self.table row_query, column_queries, opts=Vector.new([])
    TableQuery.new(row_query,column_queries, opts).table
  end

  def self.length(vector)
    vector.length
  end

  def self.max(vector)
    vector.max
  end

  def self.log2(vector)
    vector.to_values.map {|v|
      Math.log2(v)
    }
  end

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
  def self.spread(data_table)
    puts data_table.to_matrix.to_json
    matrix = data_table.to_matrix[:matrix]

    # group rows by value in the first column
    rows_by_first_column_val = matrix[:rows].group_by{ |row| row[0] }

    # new spread columns are the values in the second column - key
    new_columns = matrix[:rows].map{|r| r[1]}.uniq

    # values to the new columns are in the values in the third column - value
    rows = rows_by_first_column_val.map{ |_, r|
      hash = r.map{ |v| v[1, 2] }.to_h
      row = new_columns.map{ |c| [c, hash[c]] }
      Vector.new(row)
    }

    x = DataTable.new(
        rows_by_first_column_val.keys,
        new_columns,
        rows,
        []
    )

    puts x.to_matrix.to_json

    x
  end
end
