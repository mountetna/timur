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
    # group rows by value in the first column
    rows_by_first_column_val = data_table.rows.group_by{ |r| r.to_values[0] }

    # new columns are the values in the second column - key
    new_columns = data_table.rows.map{ |r| r.to_values[1] }.uniq

    # values to the new columns are in the third column - value
    new_rows = rows_by_first_column_val.map{ |_, r|
      col_to_val_map = r.map{ |v| v.to_values[1, 2] }.to_h
      row = new_columns.map{ |c| [c, col_to_val_map[c]] }
      Vector.new(row)
    }

    DataTable.new(
        rows_by_first_column_val.keys,
        new_columns,
        new_rows,
        []
    )
  end

  def self.diff_exp(data_table, p_value, group_one, group_two)
    input = data_table.to_matrix
    input["key"] = ""
    input["name"] = ""

    labels =  group_one.to_values.map{ |l| {label: l, value: 1} } + group_two.to_values.map{ |l| {label: l, value: 2} }
    response = Pythia.instance.get([input],
                {
                    method: "DE",
                    p_value: p_value,
                    labels: labels
                })
    if response["error"]
      response
    else
      response["method_params"]["series"][0]
    end
  end
end
