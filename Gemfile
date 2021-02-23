source 'https://rubygems.org'

# etna application/server gem
gem 'etna', git: 'https://github.com/mountetna/monoetna.git', branch: 'refs/artifacts/gem-etna/054749276887c09bb9818cb2a5769985e8f0594e'

# provides lexer/parser
gem 'rltk'
gem 'filigree', '0.3.3'

# used by sequel
gem 'pg', '~> 0.21'

# provides database models
gem 'sequel', '4.49.0'

gem 'puma', '5.0.2'
gem 'concurrent-ruby'

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
