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
    Vector.new(query_answer["answer"])
  end

  def self.table row_query, column_queries, opts=Vector.new([])
    TableQuery.new(row_query,column_queries, opts).table
  end
end
