# This file is used by Rack-based servers to start the application.

require 'yaml'
require 'bundler'
Bundler.require(:default)

require_relative 'lib/timur'
require_relative 'lib/server'

Timur.instance.configure(YAML.load(File.read('config.yml')))

# Used primarily by development servers.  These are served via apache in production.
use Rack::Static, urls: ['/css', '/fonts', '/images', '/js'], root: 'public'
use Etna::ParseBody
use Etna::SymbolizeParams
use Etna::Auth
use Etna::DescribeRoutes

run Timur::Server.new
