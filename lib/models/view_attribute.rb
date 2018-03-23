class ViewAttribute < Sequel::Model
  many_to_one :view_pane

  def to_hash
    {
      name: name,
      attribute: {
        name: name,
        attribute_class: attribute_class,
        display_name: display_name,
        plot: plot,
        placeholder: placeholder
      }.reject { |k,v| v.nil? }
    }
  end
end