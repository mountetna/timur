class ViewPane < Sequel::Model
  many_to_one(:view_tab)
  one_to_many(:view_attributes, {order: :index_order})

  def self.update(view_tab_id, pane_name, pane_data)

    return if view_tab_id.nil? || pane_name.nil?

    find_query = {
      view_tab_id: view_tab_id.to_i,
      name: pane_name.to_s
    }

    update_query = {
      title: pane_data[:title].to_s,
      index_order: pane_data[:index_order].to_i
    }

    update_query = find_query.merge(update_query)

    pane = self.first(find_query)
    if pane.nil?
      pane = self.create(update_query)
    else
      pane = pane.set(update_query).save
    end

    # Now loop over the attributes and save if needed.
    if pane_data.key?(:attributes) && pane_data[:attributes]
      pane_data[:attributes].each do |attribute_name, attribute_data|
        ViewAttribute.update(pane.id, attribute_name, attribute_data)
      end
    end
  end

  def to_hash
    {
      name: name,
      title: title,
      index_order: index_order,
      attributes: Hash[ view_attributes.map{|a| [a.name, a.to_hash] }]
    }
  end

  def remove
    self.view_attributes.each {|attribute| attribute.delete}
    self.delete
  end
end
