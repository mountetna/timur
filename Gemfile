source 'https://rubygems.org'

# etna application/server gem
gem 'etna', git: 'https://github.com/mountetna/monoetna.git', branch: 'refs/artifacts/gem-etna/c7a6aeea04f07757d7c542bd819cf795b95f3cbf'

# provides lexer/parser
gem 'rltk'
gem 'filigree', '0.3.3'

# used by sequel
gem 'pg', '~> 0.21'

# provides database models
gem 'sequel', '4.49.0'

group :development, :test do
  gem 'rspec'
  gem 'simplecov'
  gem 'pry'
  gem 'pry-byebug'
  gem 'webmock'
  gem 'factory_bot'
  gem 'database_cleaner'
  gem 'rack-test', require: "rack/test"
end
