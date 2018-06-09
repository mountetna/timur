module Archimedes
  class Manifest < RLTK::Parser::Environment
    def initialize(token, project_name, manifest)
      @token = token
      @project_name = project_name
      @manifest = manifest
      @vars = {}
    end

    def macro(var, args)
      mac = @vars[var]
      raise TypeError('Variable is not a macro') unless mac.is_a?(Archimedes::Macro)

      # use the variable for storing the value
      resolve("@#{var} = #{mac.substitute(args)}")
      value = @vars[var]

      # reset the macro
      @vars[var] = mac
      value
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
      resolve(@manifest)
    rescue RLTK::NotInLanguage
      raise Archimedes::LanguageError, "Could not resolve @#{@variable}"
    rescue Magma::ClientError => e
      raise Archimedes::LanguageError, e.body
    rescue ArgumentError => e
      raise Archimedes::LanguageError, "In @#{@variable}, #{e.message}"
    rescue TypeError => e
      if e.message =~ /nil/
        raise Archimedes::LanguageError, "Nil value error in @#{@variable}"
      else
        raise Archimedes::LanguageError, "Type error in @#{@variable}"
      end
    rescue ZeroDivisionError
      raise Archimedes::LanguageError, "Divided by zero in @#{@variable}"
    rescue
      raise Archimedes::LanguageError, "Unspecified error in @#{@variable}"
    end

    def resolve(query)
      Archimedes::InfixParser::parse(
        Archimedes::InfixLexer::lex(query),
        env: self
      )
    end
  end
end
