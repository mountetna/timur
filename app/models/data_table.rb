class DataTable
  def initialize query_json
    @name = query_json[:name]

    @row_query = query_json[:rows]
    @column_queries = Hash[
      query_json[:columns].map do |column_name, column_query|
        [
          column_name,
            [ 
              @row_query.first, 
              [ "::identifier", "::in", row_names ],
              "::all"
            ] + column_query
        ]
      end
    ]
    @order = query_json[:order]
  end

  def to_matrix
    {
      # you need to name your samples
      name: @name,
      matrix: {
        col_names: col_names,
        row_names: ordered(row_names),
        col_types: col_types,
        rows: ordered(rows)
      }
    }
  end

  private

  def ordered array
    ord = ordering
    return array unless ord
    Rails.logger.info "Ordering is #{ord}"
    ord.map do |i|
      array[i]
    end
  end

  def ordering
    return nil unless @order && columns[@order]
    @ordering ||= row_names.map.with_index do |row_name, i|
      [ columns[@order][:results][row_name], i ]
    end.sort_by do |value,i|
      value
    end.map do |value,i|
      i
    end
  end

  def columns
    @columns ||= Hash[
      @column_queries.map do |column_name, query|
        query_answer = answer(query)
        [
          column_name, 
          { 
            type: query_answer["type"],
            results: Hash[query_answer["answer"]]
          }
        ]
      end
    ]
  end

  def rows
    row_names.map do |row_name|
      columns.map do |column_name, column|
        column[:results][row_name]
      end
    end
  end

  def col_types
    columns.values.map do |column| column[:type] end
  end

  def col_names
    @column_queries.keys
  end

  def row_names
    @row_names ||= answer(row_question)["answer"].flatten.uniq
  end

  def row_question
    @row_question ||= @row_query + [ "::all", "::identifier" ]
  end

  def answer question
    status, payload = client.query(
      question
    )
    return JSON.parse(payload)
  end

  def client
    Magma::Client.instance
  end
end
