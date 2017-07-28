class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery({with: :exception})
  helper_method(:current_user)

  private

  def authenticate

    # Set the janus auth token to the session for later use.
    if cookies.key?(:UCSF_ETNA_AUTH_TOKEN)
      session[:token] = cookies[:UCSF_ETNA_AUTH_TOKEN]
    end

    unless current_user
      redirect_to(auth_path(refer: URI::encode(request.original_url)))
    end
  end

  def unauth
    redirect_to(:no_auth)
  end

  def can_read?
    current_user && current_user.can_read?(params[:project_name])
  end

  def can_edit?
    current_user && current_user.can_edit?(params[:project_name])
  end

  def readable_check
    unauth unless can_read?
  end

  def editable_check
    unauth unless can_edit?
  end

  def current_user
    @current_user ||= begin

#      # Create a development user in the development environment.
#      if Rails.env.development?
#        user = create_developer_user
#        session[:user_id] = user.id
#      end

      User.find(session[:user_id]) if session[:user_id]
    rescue
      nil
    end
  end

  def create_developer_user
    user_data = {email: 'developer@localhost', name: 'Timothy Developer'}
    user = User.where({email: auth['email']}).first_or_create.update(user_data)
  end
end
