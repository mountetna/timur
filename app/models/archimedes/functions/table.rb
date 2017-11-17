module Archimedes
  class Table < Archimedes::Function
    # This retrieves a matrix of data from Magma. Now it should use
    # the new-and-improved Vector predicate
    #
    def from_row_query(row_query, column_queries)
      row_query.concat(Vector.new([[ nil, '::all'], [ nil, column_queries ]]))
    end
   
    def initialize *args
      super
      query, @opts, opts2 = @args
      @opts ||= {}

      # hack for the old table format
      if @opts.length > 0 && @opts.all?{|label,value| value.is_a?(Archimedes::Vector)}
        query = from_row_query(query,@opts)
        if opts2 && opts2['order']
          @opts = opts2
        else
          @opts = {}
        end
      end

      # skip filters
      _, @column_queries = query.find.with_index do |(label, value), i|
        i > 1 && !query[i-1].is_a?(Archimedes::Vector)
      end
      @query = query.to_values
      @order = @opts['order']

      raise ArgumentError, "table() requires a Vector query argument." unless @column_queries.is_a?(Archimedes::Vector)
      raise ArgumentError, "Column names must be unique." unless col_names.uniq == col_names
    end

    def call
      Archimedes::Matrix.new(
        ordered(row_names), col_names, ordered(rows)
      )
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
      return nil unless @order && column = col_names.index(@order)
      @ordering ||= rows.map.with_index do |row, i|
        [ row[column], i ]
      end.sort do |a,b|
        (a.first && b.first) ? (a.first <=> b.first) : (a.first ? -1 : 1 )
      end.map(&:last)
    end

    def rows
      answer.map do |(row_name, row)|
        Vector.new(col_names.zip(row))
      end
    end

    def row_names
      @row_names ||= answer.map(&:first)
    end

    def col_names
      @column_queries.to_labels
    end

    def answer
      @answer ||= 
        begin
          response = client.query(
            @token, @project_name,
            @query
          )
          json = JSON.parse(response.body, symbolize_names: true)
          json[:answer]
        end
    end

    def client
      Magma::Client.instance
    end
  end
end
