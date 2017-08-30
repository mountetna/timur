class WelcomeController < ApplicationController
  layout 'application'
  before_filter :authenticate, except: :no_auth

  def index
  end

  def no_auth
    render(layout: 'timur', template: 'welcome/no_auth')
  end

  def auth_error
    render(layout: 'timur', template: 'welcome/auth_error')
  end
end
