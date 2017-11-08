module Archimedes
  class Table < Archimedes::Function

    # This retrieves a matrix of data from Magma. Now it should use the new-and-improved Vector predicate
   
    def initialize *args
      super

      query, opts = @args
      @row_query = row_query.to_values
      @column_queries = Hash[
        column_queries.map do |column_name, column_query|
          [
            column_name,
              [
                @row_query.first, 
                [ '::identifier', '::in', row_names ],
                '::all'
              ] + column_query.to_values
          ]
        end
      ]

      @columns = {}
      @types = {}
      @order = opts['order']
    end

    def call
      Matrix.new(ordered(row_names), col_names, ordered(rows), col_types)
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
      return nil unless @order && column(@order)
      @ordering ||= row_names.map.with_index do |row_name, i|
        [ column(@order)[row_name], i ]
      end.sort do |a,b|
        (a.first && b.first) ? (a.first <=> b.first) : (a.first ? -1 : 1 )
      end.map(&:last)
    end

    def row_names
      @row_names ||= answer(row_question)['answer'].map(&:last)
    end

    def row_question
      @row_question ||= @row_query + [ '::all', '::identifier']
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

    def column(name)
      return @columns[name] if @columns[name]
      return nil unless @column_queries[name]

      query_answer = answer(@column_queries[name])
      @types[name] = query_answer['type']

      @columns[name] = Hash[query_answer['answer'] || []]
    end

    def answer(question)
      response = client.query(
        @token, @project_name,
        question
      )
      return JSON.parse(response.body)
    end

    def client
      Magma::Client.instance
    end
  end
end
end
