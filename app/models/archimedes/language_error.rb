module Archimedes
  class LanguageError < StandardError
    attr_reader :body

    def initialize(message, body=nil)
      super(message)
      @body = body || { errors: [ message ] }
    end
  end
end
