class ViewAttribute < Sequel::Model
  many_to_one :view_pane

  def attribute_type
    case attribute_class
    when nil
      'magma'
    when 'MarkdownAttribute'
      'markdown'
    else
      'plot'
    end
  end

  def attribute_options
    case attribute_type
    when 'magma', 'markdown'
      { attribute_name: name }
    when 'plot'
      { plot_id: plot_id }
    else
      {}
    end
  end

  def to_hash
    {
      name: name,
      title: title,

      type: attribute_type
    }.merge(attribute_options)
  end
end
