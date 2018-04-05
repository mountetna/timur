class ViewAttribute < Sequel::Model
  many_to_one :view_pane

  def to_hash
    {
      id: id,
      name: name,
      title: title,
      attribute_class: attribute_class,
      index_order: index_order,
      plot_id: plot_id,
      manifest_id: manifest_id
    }
  end
end
