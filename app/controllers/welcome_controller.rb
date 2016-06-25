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

  def noauth
    render layout: "timur"
  end

  def static
    render :action => params[:path]
  end

  def auth
    auth = nil
    if defined? OmniAuth
      auth = request.env['omniauth.auth']['info']
    else
      auth = {
        'email' => 'Saurabh.Asthana@ucsf.edu',
        'name' => 'Saurabh Asthana',
        'ucsf_id' => '020141602'
      }
    end

    user = User.where(email: auth['email'].downcase).first_or_create do |u|
      u.ucsf_id = auth['ucsf_id']
      u.name = auth['name']
    end

    session[:user_id] = user.id
    redirect_to browse_path
  end
end
