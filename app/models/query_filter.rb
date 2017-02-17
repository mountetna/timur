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

  def query_join att
    @query = @query.join(
      att.link_model.table_name, :"#{att.link_model.table_name}__id" => :"#{@model.table_name}__#{att.foreign_id}"
    )
  end

  def query_where terms
    @query = @query.where(
      terms
    )
  end

  def matches_column term
    COLUMN_FORMAT.match(term) do |m|
      att_name = m[:attribute].to_sym
      att = @model.attributes[att_name]
      if att
        case att
        when Magma::ForeignKeyAttribute
          query_join att
          link_identity = :"#{att.link_model.table_name}__#{att.link_model.identity}"
          case m[:operator]
          when '='
            query_where( link_identity => m[:match_string])
          when '~'
            query_where( link_identity => /#{m[:match_string]}/i)
          end
        else
          case m[:operator]
          when '='
            query_where( att_name => m[:match_string])
          when '~'
            query_where( att_name => /#{m[:match_string]}/i)
          when '<'
            query_where( "#{att_name} < ?", m[:match_string])
          when '>'
            query_where( "#{att_name} > ?", m[:match_string] )
          end
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
