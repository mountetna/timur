source 'https://rubygems.org'

# etna application/server gem
gem 'etna', path: '/etna'

# provides lexer/parser
gem 'rltk'
gem 'filigree', '0.3.3'

# used by sequel
gem 'pg', '~> 0.21'

# provides database models
gem 'sequel', '4.49.0'

gem 'puma', '>=5.0.2'
gem 'concurrent-ruby'

group :development, :test do
  gem 'rspec'
  gem 'simplecov'
  gem 'pry'
  gem 'pry-byebug'
  gem 'webmock'
  gem 'factory_bot'
  gem 'database_cleaner', '1.8.0'
  gem 'rack-test', require: "rack/test"
end
