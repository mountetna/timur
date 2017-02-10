class WelcomeController <  ApplicationController
  def index
    redirect_to "https://www.immunoprofiler.org"
  end

  def login
    if Rails.env.development?
      redirect_to auth_path
    else
      redirect_to auth_shib_path
    end
  end

  def noauth
    render layout: "timur"
  end

  def static
    render :action => params[:path]
  end

  def auth
    auth = nil
    if Rails.env.development?
      auth = {
        'email' => 'developer@localhost',
        'name' => 'Timothy Developer',
        'ucsf_id' => '999999'
      }
    else
      auth = request.env['omniauth.auth']['info']
    end

    user = User.where(email: auth['email'].downcase).first_or_create do |u|
      u.ucsf_id = auth['ucsf_id']
      u.name = auth['name']
    end

    session[:user_id] = user.id
    redirect_to browse_path
  end
end
