module Archimedes
  class Question < Archimedes::Function
    def call
      query, *_ = @args

      host = Timur.instance.config(:magma).fetch(:host)

      client = Etna::Client.new(
        "https://#{host}",
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
      response = client.send(
        'body_request',
        Net::HTTP::Post,
        hmac.url_params[:path] + '?' + URI.encode_www_form(cgi_hash),
        query_params)

      query_answer = JSON.parse(response.body)

      # Loop the data and set the data types returned from Magma.
      recursive_parse(query_answer['answer']) do |item|
        case item
        when /^(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/
          DateTime.parse(item)
        when Array
          item.all?{|v| v.is_a?(Array) && v.length == 2}? Vector.new(item) : item
        else
          item
        end
      end
    end
    
    def recursive_parse(result, &block)
      case result
      when Array
        block.call(result.map{ |item| recursive_parse(item, &block) })
      when Hash
        block.call(Hash[result.map{ |key,item| [ key, recursive_parse(item, &block)] }])
      else
        block.call(result)
      end
    end
  end
end
