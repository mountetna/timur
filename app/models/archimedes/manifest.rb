# This is a list of requests for variables.
#
# The request comes in this form:
# [
#   [ "var_name", "calculation" ]
# ]
#
# A calculation is an infix expression:
#
#   x / y
#
# The terms in a calculation are:
# 1) A String, Number, Boolean
# 2) A List of each of these.
# 3) A function
#
#
# An example manifest:
#
# {
#   "record_name": {
#     type: "formula",
#     value: '"IPIMEL069.T1"'
#   },
#   "experiment_name: {
#     type: "question",
#     value: [ "sample", [ "sample_name", "::equals", "@record_name" ], "::first", "patient", "experiment", "name" ]
#   },
#   "qc": {
#     type: "table",
#     value: {
#       rows: [ "sample", [ "patient", "experiment", "name", "::equals", "@experiment_name" ] ],
#       columns: {
#         treg_cd45_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
#         nktb_cd45_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
#         sort_cd45_count: [ "population", [ "stain", "::equals", "sort" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
#         dc_cd45_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "CD45+" ], "::first", "count" ],
#         treg_live_count: [ "population", [ "stain", "::equals", "treg" ], [ "name", "::equals", "Live" ], "::first", "count" ],
#         nktb_live_count: [ "population", [ "stain", "::equals", "nktb" ], [ "name", "::equals", "Live" ], "::first", "count" ],
#         sort_live_count: [ "population", [ "stain", "::equals", "sort" ], [ "name", "::equals", "Live" ], "::first", "count" ],
#         dc_live_count: [ "population", [ "stain", "::equals", "dc" ], [ "name", "::equals", "Live" ], "::first", "count" ],
#       }
#     }
#   },
#   heights: {
#     type: "vector",
#     value: {
#       items: [
#         "@qc.treg_cd45_count / @qc.nktb_cd45_count",
#         "@qc.treg_cd45_count / @qc.nktb_cd45_count",
#       ]
#     }
#   }
# }

module Archimedes
  class Manifest < RLTK::Parser::Environment
    class << self
      def create(*args)
        manifest = self.new
        manifest.init(*args)
        manifest
      end
    end

    def init(token, project_name, manifest)
      @token = token
      @project_name = project_name
      @manifest = manifest
      @vars = {}
    end

    def macro(mac, args)
      raise TypeError('Variable is not a macro') unless mac.is_a?(Archimedes::Macro)
      resolve(mac.substitute(args))
    end

    def payload
      fill_manifest

      Hash[
        @vars.map do |var, value|
          [ var, value.respond_to?(:payload) ? value.payload : value ]
        end
      ]
    end

    private

    def fill_manifest
      @manifest.each do |variable, query|
        begin
          @vars[variable] = resolve(query)
        rescue RLTK::NotInLanguage => e
          raise LanguageError, "Could not resolve @#{variable} = #{query}"
        end
      end
    end

    def resolve(query)
      Archimedes::InfixParser::parse(
        Archimedes::InfixLexer::lex(query),
        env: self
      )
    end
  end
end
