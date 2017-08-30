class JanusRequest
  def initialize(endpoint, token)
    @endpoint = endpoint
    @token = token
  end

  def json_body
    return nil if response.code.to_i >= 400
    JSON.parse(response.body, symbolize_names: true)
  rescue
    nil
  end

  private

  def response
    @response ||= connection.request(request)
  end

  def request
    request = Net::HTTP::Post.new(uri.path)

    request.set_form_data(
      token: @token,
      app_key: Rails.application.secrets.app_key
    )

    request
  end

  def uri
    @uri ||= URI.parse(
      Rails.application.secrets.janus_addr.chomp('/') + "/#{@endpoint}"
    )
  end

  def connection
    https_conn = Net::HTTP.new(uri.host, uri.port)
    https_conn.use_ssl = true
    https_conn.verify_mode = OpenSSL::SSL::VERIFY_PEER
    https_conn.open_timeout = 20
    https_conn.read_timeout = 20
    https_conn
  end
end
