source 'https://rubygems.org'


gem 'extlib'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.0'

# Use postgres as the database for Active Record
gem 'pg'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

gem 'haml-rails', '>= 1.0.0'

gem 'rltk'

gem 'magma'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  gem 'spring'

  gem 'rspec'

  gem 'simplecov'

  gem 'pry'
end

#gem 'devise'

group :test, :production do
  gem 'omniauth-shibboleth'
end
