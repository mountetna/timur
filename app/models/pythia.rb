require 'singleton'

class Pythia
  include Singleton

  def get( inputs, params, columns = false )
    response = request( {
                               input: {
                                   series: inputs
                               },
                               params: {
                                   method_params: params
                               },
                               columns: columns
                           })
    JSON.parse(response.body)
  end

  private

  def request data
    uri = URI.parse(Rails.configuration.pythia_url+"json/")
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    request = Net::HTTP::Post.new(uri.request_uri)
    request.basic_auth(
        Rails.application.secrets.pythia_auth_user,
        Rails.application.secrets.pythia_auth_passwd
    )
    request.body = data.to_json
    request["Content-Type"] = "application/json"
    http.request(request)
  end
end