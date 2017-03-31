class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :current_user

  private

  def authenticate
    redirect_to :login unless current_user

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

  def readable_check
    unauth unless can_read?
  end

  def editable_check
    unauth unless can_edit?
  end

  def current_user
    if Rails.env.development?
      auth = {
        'email' => 'developer@localhost',
        'name' => 'Timothy Developer',
        'ucsf_id' => '999999'
      }
      user = User.where(email: auth['email'].downcase).first_or_create do |u|
        u.ucsf_id = auth['ucsf_id']
        u.name = auth['name']
      end
    end

    session[:user_id] = user.id
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
end
