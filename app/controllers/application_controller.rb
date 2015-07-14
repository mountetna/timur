class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user

  private

  def authenticate
    redirect_to :login

    # you passed external auth, now internal
  end

  def unauth
    redirect_to :noauth
  end

  def can_read?
    current_user && current_user.can_read?
  end

  def can_edit?
    current_user && current_user.can_edit?
  end

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
end
