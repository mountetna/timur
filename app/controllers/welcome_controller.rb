class WelcomeController <  ApplicationController
  def index
  end

  def login
    if defined? OmniAuth
      redirect_to auth_shib_path
    else
      redirect_to auth_path
    end
  end

  def auth
    if defined? OmniAuth
      auth = request.env['omniauth.auth']
    else
    end
    redirect_to_root_url
  end
end
