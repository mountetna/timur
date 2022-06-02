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

Timur.instance.configure(YAML.load(File.read('config.yml')))

OUTER_APP = Rack::Builder.new do
  use Etna::ParseBody
  use Etna::SymbolizeParams
  use Etna::TestAuth
  use Etna::DescribeRoutes
  run Timur::Server.new
end

AUTH_USERS = {
  admin: {
    email: 'hera@olympus.org', name: 'Hera', perm: 'a:labors'
  },
  editor: {
    email: 'eurystheus@twelve-labors.org', name: 'Eurystheus', perm: 'e:labors' 
  },
  viewer: {
    email: 'hercules@twelve-labors.org', name: 'Hercules', perm: 'v:labors' 
  },
  non_user: {
    email: 'nessus@centaurs.org', name: 'Nessus', perm: ''
  },
  guest: {
    email: 'sinon@troy.org', name: 'Sinon', perm: 'g:labors'
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
  txt = script

  manifest = Archimedes::Manifest.new(
    'xyzzy',
    'timur',
    txt
  )
  manifest.payload
  manifest.instance_variable_get('@return_vars')
end

FactoryBot.define do
  factory :view do
    to_create(&:save)
  end

  factory :manifest do
    to_create(&:save)
    project_name { 'labors' }
    sequence :name do |n|
      "manifest #{n}"
    end

    trait :script do
      script { '@value = 1 + 1' }
    end

    trait :public do
      access { 'public' }
    end

    trait :private do
      access { 'private' }
    end
  end

  factory :plot do
    to_create(&:save)
    project_name { 'labors' }
    script { '@test = 1' }
    sequence :name do |n|
      "plot #{n}"
    end

    trait :scatter do
      plot_type { 'scatter' }
      configuration { {plot: 'ok'} }
    end

    trait :public do
      access { 'public' }
    end

    trait :private do
      access { 'private' }
    end
  end

  factory :user do
    to_create(&:save)

    AUTH_USERS.each do |user_type, template|
      trait user_type do
        email { template[:email] }
        name { template[:name] }
      end
    end
  end
end

def get_document doc_type, id, user=:viewer
  auth_header(user)
  get("#{document_path(doc_type)}/#{id}")
end

def fetch_documents doc_type, user=:viewer
  auth_header(user)
  get("#{document_path(doc_type)}/fetch")
end

def create_document doc_type, request, user=:viewer
  auth_header(user)
  json_post("#{document_path(doc_type)}/create", request)
end

def update_document doc_type, id, update={}, user=:viewer
  auth_header(user)
  json_post("#{document_path(doc_type)}/update/#{id}", update)
end

def destroy_document doc_type, id, user=:viewer
  auth_header(user)
  delete("#{document_path(doc_type)}/destroy/#{id}")
end

def document_path(doc_type)
  "api/#{doc_type}s/labors"
end

def json_body
  JSON.parse(last_response.body, symbolize_names: true)
end

def json_post(endpoint, hash)
  post("/#{endpoint}", hash.to_json, {'CONTENT_TYPE'=> 'application/json'})
end

def below_admin_roles
  [:editor, :viewer, :guest]
end

def below_editor_roles
  [:viewer, :guest]
end