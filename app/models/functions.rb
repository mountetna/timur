module Functions
  def self.call function, args
    if Functions.respond_to? function
      Functions.send function.to_sym, *args
    end
  end

  def self.table row_query, column_queries, order=nil
    TableQuery.new(row_query,column_queries, order).table
  end
end
