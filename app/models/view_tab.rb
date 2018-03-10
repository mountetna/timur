# Structure of the view:
#
# View
#   Tabs
#     Panes
#       Attributes
#
# Each tab has a list of panes.
# Each pane has a list of attributes.

class ViewTab < ActiveRecord::Base
  has_many :view_panes, dependent: :destroy

  def self.retrieve_view(project_name, model_name)

    # Pull a specific view model from the given project name.
    tabs = self.where(project: project_name, model: model_name)
      .order(:index_order)
      .all
      
    # Return an empty view data object if there are no entries.
    return generate_default_tab(project_name, model_name) if tabs.empty? 

    # Return the hashed data object.
    return {
      views: Hash[
        model_name,
        {
          model_name: model_name,
          project_name: project_name,
          tabs: Hash[

            tabs.map do |tab|
              [
                tab[:name],
                {
                  name: tab[:name],
                  title: tab[:title],
                  description: tab[:description],
                  index_order: tab[:index_order],
                  panes: ViewPane.retrieve_panes(tab[:id])
                }
              ]
            end

          ]
        }
      ]
    }
  end

  def self.generate_default_tab(project_name, model_name)
    return {
      views: Hash[
        model_name,
        {
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
                  id: nil,
                  name: 'default',
                  title: '',
                  description: '',
                  index_order: 0,
                  attributes: { # Here we should return the default attributes for the model.
                  }
                }
              }
            }
          }
        }
      ]
    }
  end

  def self.update(project_name, model_name, tab_name, tab_data)

    return if project_name.nil? || model_name.nil? || tab_name.nil?

    find_query = {
      project: project_name,
      model: model_name,
      name: tab_data['name']
    }

    update_query = {
      title: tab_data['title'],
      description: tab_data['description'],
      index_order: tab_data['index_order']
    }

    update_query = find_query.merge(update_query)

    # First try and find a matching record. If there is not one then create one.
    # If there is one then update the record.
    self.where(find_query)
      .first_or_create(update_query)
      .update(update_query)

    # Pull the record that was just updated/created
    tab = self.where(update_query).first

    # Now loop over the panes and save if needed.
    if tab_data.key?('panes') && tab_data['panes']
      tab_data['panes'].each do |pane_name, pane_data|
        ViewPane.update(tab.id, pane_name, pane_data)
      end
    end

    
  end
end
