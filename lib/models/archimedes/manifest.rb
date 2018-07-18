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

    def current_fragment
      bounds = [ @positions[0], @positions[-1] ]
      line = bounds.map(&:line_number).compact.uniq
      "in #{
        line.length == 1 ? :line : :lines
      } #{
        line.length == 1 ? line.first : line.join('-')
      }, expression `#{
        @manifest[bounds[0].stream_offset..bounds[1].stream_offset]
      }`"
    end

    def line_fragment(line,position)
      lines = @manifest.split(/\n/)

      current_line = lines[line-1]
      # the previous ten characters with rest of word, if possible
      before = current_line[0..position].scan(/(^.{0,9}|(?<=^|\s)\S*.{10}).$/x).flatten.first
      # the next ten characters with rest of word, if possible
      after = current_line[position..-1].scan(/^((.{10}\S*)(?=\s|$)|.{0,9}$)/).flatten.first
      "line #{line}, near expression `#{before}#{after}`"
    end

    def fill_manifest
      resolve(@manifest)
    rescue RLTK::NotInLanguage => e
      current_position = e.current.position
      line = current_position.line_number
      position = current_position.line_offset
      raise Archimedes::LanguageError, "Syntax error in #{line_fragment(line,position)}"
    rescue Magma::ClientError => e
      raise Archimedes::LanguageError, e.body
    rescue ArgumentError => e
      raise Archimedes::LanguageError, e.message
    rescue TypeError => e
      if e.message =~ /nil/
        raise Archimedes::LanguageError, "Nil value error in #{current_fragment}"
      else
        raise Archimedes::LanguageError, "Type error in #{current_fragment}"
      end
    rescue ZeroDivisionError
      raise Archimedes::LanguageError, "Divided by zero in #{current_fragment}"
    rescue
      raise Archimedes::LanguageError, "Unspecified error in #{current_fragment}"
    end

    def resolve(query)
      Archimedes::InfixParser::parse(
        Archimedes::InfixLexer::lex(query),
        env: self
      )
    end
  end
end
