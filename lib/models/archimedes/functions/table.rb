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
        Vector.new(col_names.zip(
          row.map{|l| l.is_a?(Numeric) ? l.to_f : l}.flatten(1)
        ))
      end
    end

    def row_names
      @row_names ||= answer.map(&:first)
    end

    def col_names
      @col_names ||= begin
        _, column_formats = format
        @column_queries.to_labels.map.with_index do |label, i|
          column_formats[i].is_a?(Array) ? column_formats[i][1] : label
        end.flatten
      end
    end

    def response
      @response ||= JSON.parse(
        query_response.body,
        symbolize_names: true
      )
    end

    def answer
      response[:answer]
    end

    def format
      response[:format]
    end

    def query_response
      host = Timur.instance.config(:magma).fetch(:host)

      client = Etna::Client.new(
        host,
        @token)
      
      query_route = client.routes.find { |r| r[:name] == 'query' }
      
      path = client.route_path(
        query_route, {})

      query_params = {
        project_name: @project_name,
        query: @query
      }

      # Now populate the standard headers
      hmac_params = {
        method: 'POST',
        host: host,
        path: path,

        expiration: (DateTime.now + 10).iso8601,
        id: 'archimedes',
        nonce: SecureRandom.hex,
        headers: query_params,
      }

      hmac = Etna::Hmac.new(Timur.instance, hmac_params)

      cgi_hash = CGI.parse(hmac.url_params[:query])
      cgi_hash.delete('X-Etna-Query') # this could be too long for URI

      hmac_params_hash = Hash[cgi_hash.map {|key,values| [key.to_sym, values[0]||true]}]
      client.send(
        'body_request',
        Net::HTTP::Post,
        hmac.url_params[:path] + '?' + URI.encode_www_form(cgi_hash),
        query_params)
    end
  end
end
