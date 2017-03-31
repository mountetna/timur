class WelcomeController <  ApplicationController
  def index
    redirect_to "https://www.immunoprofiler.org"
  end

  def login
    redirect_to auth_shib_path
  end

  def noauth
    render layout: "timur"
  end

  def static
    render :action => params[:path]
  end

  def auth
    auth = request.env['omniauth.auth']['info']

    user = User.where(email: auth['email'].downcase).first_or_create do |u|
      u.ucsf_id = auth['ucsf_id']
      u.name = auth['name']
    end

    session[:user_id] = user.id
    redirect_to browse_path
  end
end
