class TableQuery
  def initialize(row_query, column_queries, order)
    @row_query = row_query.to_a
    @column_queries = Hash[
      column_queries.map do |column_query, column_name|
        [
          column_name,
            [
              @row_query.first, 
              [ "::identifier", "::in", row_names ],
              "::all"
            ] + column_query.to_a
        ]
      end
    ]
    @columns = {}
    @types = {}
    @order = order
  end

  def table
    DataTable.new(row_names, col_names, rows, col_types)
  end

  private

  def ordered array
    if ordering
      array.values_at(*ordering)
    else
      array
    end
  end

  def ordering
    return nil unless @order && column[@order]
    @ordering ||= row_names.map.with_index do |row_name, i|
      [ columns[@order][:results][row_name], i ]
    end.sort_by(&:first).map(&:last)
  end

  def row_names
    @row_names ||= answer(row_question)["answer"].map(&:last)
  end

  def row_question
    @row_question ||= @row_query + [ "::all", "::identifier" ]
  end

  def rows
    row_names.map do |row_name|
      Vector.new( 
        col_names.map do |column_name|
          [ column_name, column(column_name)[row_name] ]
        end
      )
    end
  end

  def col_names
    @column_queries.keys
  end

  def col_types
    col_names.map do |name| @types[name] end
  end

  def column name
    return @columns[name] if @columns[name]

    return nil unless @column_queries[name]
   
    query_answer = answer(@column_queries[name])
    @types[name] = query_answer["type"]
    @columns[name] = Hash[query_answer["answer"]]
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
