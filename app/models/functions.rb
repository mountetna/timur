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
end
