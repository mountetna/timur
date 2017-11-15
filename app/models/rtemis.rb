require 'singleton'

class Rtemis
  include Singleton

  def call( func, *args )
    response = request({
      func: func,
      args: args.map do |arg|
        arg.respond_to?(:payload) ? arg.payload : arg
      end
    })
    response = JSON.parse(response.body)
    output = response["output"]
    return parse_output(output)
  end

  private

  def parse_output(output)
    if output.is_a?(Hash)
      if output["matrix"]
        return Archimedes::Matrix.from_matrix(output["matrix"])
      elsif output["vector"]
        return Archimedes::Vector.new(output["vector"].map{|item|
          [ item["label"], parse_output(item["value"]) ]
        })
      end
    else
      return output
    end
  end

  private

  def request data
    uri = URI.parse(Rails.application.secrets.rtemis_addr)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    request = Net::HTTP::Post.new(uri.request_uri)
    request.body = data.to_json
    request["Content-Type"] = "application/json"
    request["Accept"] = "application/json"
    http.request(request)
  end
end
