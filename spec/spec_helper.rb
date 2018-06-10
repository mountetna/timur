require 'bundler'
Bundler.require(:default, :test)

ENV['TIMUR_ENV'] = 'test'

require 'webmock/rspec'

require 'simplecov'
SimpleCov.start

require 'yaml'
require 'factory_bot'
require 'database_cleaner'
require 'rack/test'

require_relative '../lib/server'
require_relative '../lib/timur'

OUTER_APP = Rack::Builder.new do
  use Etna::ParseBody
  use Etna::SymbolizeParams

  use Etna::TestAuth
  run Timur::Server.new(YAML.load(File.read('config.yml')))
end
Magma.instance.configure(Timur.instance.config(:magma))

AUTH_USERS = {
  admin: {
    email: 'hera@olympus.org', first: 'Hera', perm: 'a:labors'
  },
  editor: {
    email: 'eurystheus@twelve-labors.org', first: 'Eurystheus', perm: 'e:labors' 
  },
  viewer: {
    email: 'hercules@twelve-labors.org', first: 'Hercules', perm: 'v:labors' 
  },
  non_user: {
    email: 'nessus@centaurs.org', first: 'Nessus', perm: ''
  }
}

def auth_header(user_type)
  header(*Etna::TestAuth.token_header(AUTH_USERS[user_type]))
end

RSpec.configure do |config|
  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end

  config.shared_context_metadata_behavior = :apply_to_host_groups
  config.example_status_persistence_file_path = 'spec/examples.txt'
  #config.warnings = true

  config.include FactoryBot::Syntax::Methods

  config.before(:suite) do
    FactoryBot.find_definitions
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.around(:each) do |example|
    DatabaseCleaner.cleaning do
      example.run
    end
  end
end


def run_script script
  txt = script.map do |name, exp|
    "@#{name} = #{exp}"
  end.join("\n")

  manifest = Archimedes::Manifest.new(
    'xyzzy',
    'timur',
    txt
  )
  manifest.payload
  manifest.instance_variable_get('@vars')
end

FactoryBot.define do
  factory :view_tab do
    to_create(&:save)
  end

  factory :view_pane do
    to_create(&:save)
  end

  factory :view_attribute do
    to_create(&:save)
  end

  factory :manifest do
    to_create(&:save)
    project 'labors'
    sequence :name do |n|
      "manifest #{n}"
    end

    trait :script do
      script '@value = 1 + 1'
    end

    trait :public do
      access 'public'
    end

    trait :private do
      access 'private'
    end
  end

  factory :plot do
    to_create(&:save)
    project 'labors'
    sequence :name do |n|
      "plot #{n}"
    end

    trait :scatter do
      plot_type 'scatter'
      configuration(plot: 'ok')
    end

    trait :public do
      access 'public'
    end

    trait :private do
      access 'private'
    end
  end

  factory :user do
    to_create(&:save)

    AUTH_USERS.each do |user_type, template|
      trait user_type do
        email template[:email]
        name "#{template[:first]} #{template[:last]}"
      end
    end
  end
end

def json_body
  JSON.parse(last_response.body, symbolize_names: true)
end

def json_post(endpoint, hash)
  post("/#{endpoint}", hash.to_json, {'CONTENT_TYPE'=> 'application/json'})
end
