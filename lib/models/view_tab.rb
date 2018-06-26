class ViewTab < Sequel::Model
  one_to_many(:view_panes, {order: :index_order})

  def self.generate_default_tab(project_name, model_name)
    return {
      project_name: project_name,
      model_name: model_name,
      tabs: {
        default: {
          name: 'default',
          title: '',
          description: '',
          index_order: 0,
          panes: {
            default: {
              name: 'default',
              title: '',
              description: '',
              index_order: 0,
              attributes: {
                # Here we should return the default attributes for the model.
              }
            }
          }
        }
      }
    }
  end

  def self.update(project_name, model_name, tab_name, tab_data)

    return if project_name.nil? || model_name.nil? || tab_name.nil?

    find_query = {
      project: project_name.to_s,
      model: model_name.to_s,
      name: tab_name.to_s
    }

    update_query = {
      title: tab_data[:title].to_s,
      description: tab_data[:description].to_s,
      index_order: tab_data[:index_order].to_i
    }

    update_query = find_query.merge(update_query)

    tab = self.first(find_query)

    if tab.nil?
      tab = self.create(update_query)
    else
      tab = tab.set(update_query).save
    end

    # Now loop over the panes and save if needed.
    if tab_data.key?(:panes) && tab_data[:panes]
      tab_data[:panes].each do |pane_name, pane_data|
        ViewPane.update(tab.id, pane_name, pane_data)
      end
    end
  end

  def remove
    self.view_panes.each {|pane| pane.remove}
    self.delete
  end

  def to_hash
    {
      name: name,
      title: title,
      description: description,
      index_order: index_order,
      panes: Hash[view_panes.map {|p| [p.name, p.to_hash] }]
    }
  end
end
