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
class ManifestQuery
  def initialize value, vars
    @value = value
    @vars = vars
  end
end

class CalculationQuery < ManifestQuery
  def result
    InfixParser.new(@value, @vars).value
  end
end

class VectorQuery < ManifestQuery
  def result
    items = @value["items"].map do |item|
      CalculationQuery.new(item, @vars).result
    end
    @value.merge( "items" => items )
  end
end

class QuestionQuery < ManifestQuery

  def result
    client = Magma::Client.instance
    status, payload = client.query(
      @vars.question_substitute(@value)
    )
    return JSON.parse(payload)
  end
end

class TableQuery < ManifestQuery
  def result
    table = DataTable.new(
      @value.merge(
        rows: @vars.question_substitute(@value[:rows]),
        columns: Hash[
          @value[:columns].map do |column_name, column_query|
            @vars.question_substitute(column_query)
          end
        ]
      )
    )
    table.to_matrix
  end
end

class VarSet
  def initialize
    @vars = {}
  end

  def []= variable, value
    @vars[variable] = value
  end

  def question_substitute value
    value.map do |item|
      if item.is_a?(Array)
        question_substitute(item)
      elsif var = item[/@(\w+)/, 1]
        @vars[var]
      else
        item
      end
    end
  end

  def value_substitute text
    text.gsub(/@(\w+)/) do
      @vars[Regexp.last_match[1]]
    end
  end
end

class DataManifest
  def initialize manifest
    @manifest = manifest
    @vars = VarSet.new
  end

  def fill
    @manifest.each do |variable, query|
      @vars[variable] = resolve(query)
    end
  end

  def payload
    @vars.to_hash
  end

  private

  def resolve(query)
    Rails.logger.info "Resolving #{query}"
    query_class = case query["type"]
    when "formula"
      CalculationQuery
    when "vector"
      VectorQuery
    when "question"
      QuestionQuery
    when "table"
      TableQuery
    end
    query_class.new(query["value"], @vars).result
  end
end
