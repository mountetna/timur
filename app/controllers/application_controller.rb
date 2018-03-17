class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user

  private

  def authenticate
    # If the user do NOT have a cookie, they must go to Janus and get one.
    if !token
      redirect_to(janus_login_path(request.original_url))
      return
    end

    # The user does not have a cookie, try to load a user.
    redirect_to(:no_auth) unless current_user
  end

  def readable_check
    redirect_to(:no_auth) unless can_read?
  end

  def editable_check
    redirect_to(:no_auth) unless can_edit?
  end

  def token
    @token ||= cookies[:JANUS_TOKEN]
  end

  def janus_login_path(refer)
    uri = URI(
      Rails.application.secrets.janus_addr.chomp('/') + '/login'
    )
    uri.query = URI.encode_www_form(refer: refer)
    return uri.to_s
  end

  def can_read?
    current_user && current_user.can_read?(params[:project_name])
  end

  def can_edit?
    current_user && current_user.can_edit?(params[:project_name])
  end

  def current_user
    @current_user ||= 
      begin
        # Get the whitelist. If for any reason you cannot this will be nil.
        whitelist = Whitelist.for_token(token)

        # If the whitelist exists, it has a user.
        whitelist ? whitelist.user : nil
      end
  end

  def create_developer_user
    user_data = {email: 'developer@localhost', name: 'Timothy Developer'}
    user = User.where(email: auth['email']).first_or_create.update(user_data)
  end


  def ajax_req_authenticate
    if !current_user
      render(
        :json => { :errors => ['You must be logged in.'] },
        :status => 401
      ) and return
    end
  end

  def error_response(resource)
    render :json => { :errors => resource.errors.full_messages }, :status => 422
  end

  def delete(resource)
    if resource.destroy
      render json: { :success => true }
    else
      error_response(resource)
    end
  end
end
