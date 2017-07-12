class WelcomeController < ApplicationController
  layout 'application'

  # Run the login cycle through Janus.
  def login
    base = 'https://janus-stage.ucsf.edu/login'
    refer = '?refer=http%3A%2F%2Ftimur-dev.ucsf.edu%2Fauth'
    redirect_to(base+refer)
  end

  def noauth
    render({layout: 'timur'})
  end

  def static
    render({action: params[:path]})
  end

  # The timur user cache is just a the database table 'private.whitelists'. Here
  # we keep a copy of the user data from Janus so we don't have to keep hitting 
  # Janus every request. The cache is short lived (a few minutes), but even 
  # still, this should cut down on Janus '/check' requests quite a bit.

  def auth
    # There is no auth token present. Run the Janus login cycle.
    unless cookies.key?(:UCSF_ETNA_AUTH_TOKEN)
      login
      return
    end

    # Sets/checks a user on the whitelist after authenticating with Janus.
    whitelist = whitelist_user(cookies[:UCSF_ETNA_AUTH_TOKEN])

    # Pulls or creates a user based upon the whitelist email.
    user = User.where({email: whitelist[:email]}).first_or_create do |u|
      u.name = whitelist.first_name+whitelist.last_name
    end

    # Set the user_id on the session and redirect to the clients end point.
    session[:user_id] = user.id
    session[:token] = cookies[:UCSF_ETNA_AUTH_TOKEN]

    # Right now this application is hard coded to use the Immunoprofiler
    # Initiaive project (Ipi). This needs to be changed out.
    redirect_to('/browse/Ipi')
  end

  private

  def whitelist_user(token)
    # Pull the Whitelist record by the token.
    whitelist = Whitelist.where({token: token}).first

    # Check if there is a current whitelist record and delete the record if it
    # is expired. Whitelist record expire time is set at 5 minutes.
    if whitelist != nil && whitelist.expired?
      whitelist.destroy
      whitelist = nil
    end

    # If there is no whitelist record, but we have a token, we need to check the
    # token against Janus first and then create a whitelist record with it's
    # assiciated permissions.
    if whitelist == nil
      user_info = check_janus(token)

      # Update or create the whitelist record.
      data = {
        email: user_info['email'],
        first_name: user_info['first_name'],
        last_name: user_info['last_name'],
        token: token
      }
      qry = {email: user_info['email']}
      whitelist = Whitelist.where(qry).first_or_create.update(data)

      # Check that the create/update was successful.
      redirect_to(auth_error) unless whitelist

      # Pull the updated whitelist record and set the permissions.
      whitelist = Whitelist.where({token: token}).first
      whitelist.associate_permissions(user_info['permissions'])
    end

    return whitelist
  end

  def check_janus(token)
    user_data = JSON.parse(make_janus_request(token, 'check'))

    # The returned data is malformed. Run the Janus auth cycle.
    redirect_to(auth_error_path) unless user_data.key?('success')

    # The data returned is fine but the check came back invalid. Run the Janus
    # auth cycle.
    redirect_to(auth_failure_path) unless user_data['success']

    # Everything is great.
    return user_data['user_info']
  end

  # Make a request to Janus for the user permissions.
  def make_janus_request(token, end_point)
    begin
      app_key = Rails.application.secrets['app_key']
      janus_url = Rails.application.secrets['janus_addr']
      data = {token: token, app_key: app_key}

      uri = URI.parse("#{janus_url}/#{end_point}")

      https_conn = Net::HTTP.new(uri.host, uri.port)
      https_conn.use_ssl = true
      https_conn.verify_mode = OpenSSL::SSL::VERIFY_PEER
      https_conn.open_timeout = 20
      https_conn.read_timeout = 20

      request = Net::HTTP::Post.new(uri.path)
      request.set_form_data(data)

      response = https_conn.request(request)
      status = response.code.to_i

      # If something went wrong with the janus server...
      redirect_to(auth_error_path) if status >= 400

      # Everything worked out fine.
      return response.body
    rescue
      # If something went wrong with the janus connection...
      redirect_to(auth_error_path)
    end
  end
end
