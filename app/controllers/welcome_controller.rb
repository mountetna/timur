class WelcomeController <  ApplicationController
  def index
  end

  def login
    @auth = request.env['omniauth.auth']
  end
end
