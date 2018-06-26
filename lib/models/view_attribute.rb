class ViewAttribute < Sequel::Model
  many_to_one(:view_pane)

  def self.update(view_pane_id, attribute_name, attribute_data)

    return if view_pane_id.nil? || attribute_name.nil?

    find_query = {
      view_pane_id: view_pane_id.to_i,
      name: attribute_name.to_s
    }

    update_query = {
      title: attribute_data[:title].to_s,
      attribute_class: attribute_data[:attribute_class].to_s,
      index_order: attribute_data[:index_order].to_i,
      plot_id: attribute_data[:plot_id],
      manifest_id: attribute_data[:manifest_id]
    }

    update_query = find_query.merge(update_query)

    attribute = self.first(find_query)
    if attribute.nil?
      attribute = self.create(update_query)
    else
      attribute = attribute.set(update_query).save
    end
  end

  def to_hash
    {
      name: name,
      title: title,
      attribute_class: attribute_class,
      index_order: index_order,
      plot_id: plot_id,
      manifest_id: manifest_id
    }
  end
end
