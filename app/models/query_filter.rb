class QueryFilter
  def initialize model, query, filter
    @model = model
    @query = query

    @text_columns = @model.attributes.values.select do |att|
      att.type == String
    end.map(&:column_name)

    @terms = filter.split(/\s+/)
  end

  def matches_any term
    @query = @query.full_text_search(@text_columns, term)
  end

  COLUMN_FORMAT = /
    ^
    (?<attribute>[\w]+)  # the column name
    (?<operator>[=<>~])  # the operator
    (?<match_string>.*)      # the rest
    $
  /x

  def matches_column term
    COLUMN_FORMAT.match(term) do |m|
      att_name = m[:attribute].to_sym
      if @model.attributes[att_name]
        case m[:operator]
        when '='
          @query = @query.where(
            m[:attribute].to_sym => m[:match_string]
          )
        when '~'
          @query = @query.where(
            m[:attribute].to_sym => /#{m[:match_string]}/i
          )
        when '<'
          @query = @query.where(
            "#{m[:attribute]} < ?", m[:match_string]
          )
        when '>'
          @query = @query.where(
            "#{m[:attribute]} > ?", m[:match_string]
          )
        end
        return true
      end
    end
    nil
  end

  def query
    @terms.each do |term|
      next if term.empty?
      next if matches_column(term)
      matches_any(term)
    end

    @query
  end
end
