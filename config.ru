# This file is used by Rack-based servers to start the application.

require 'yaml'
require 'bundler'
Bundler.require(:default)

require_relative 'lib/timur'
require_relative 'lib/server'

Timur.instance.configure(YAML.load(File.read('config.yml')))

use Etna::MetricsExporter
use Etna::ParseBody
use Etna::SymbolizeParams
use Etna::Auth
use Etna::DescribeRoutes

run Timur::Server.new
