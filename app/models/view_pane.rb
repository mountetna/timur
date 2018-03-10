# Structure of the view:
#
# View
#   Tabs
#     Panes
#       Attributes
#
# Each tab has a list of panes.
# Each pane has a list of attributes.

class ViewPane < ActiveRecord::Base
  belongs_to :view_tab
  has_many :view_attributes, dependent: :destroy

  # Pull all of the panes for a tab.
  def self.retrieve_panes(tab_id)

    panes = self.where(view_tab_id: tab_id)
      .order(:index_order)
      .all

    # Return an empty pane data object if there are no entries.
    if panes.empty?
      return {
        default: {
          name: 'default',
          title: '',
          index_order: 0,
          attributes: {
          }
        }
      }
    end

    # Return the hashed data object.
    return Hash[

      panes.map do |pane|
        [
          pane[:name],
          {
            name: pane[:name],
            title: pane[:title],
            index_order: pane[:index_order],
            attributes: ViewAttribute.retrieve_attributes(pane[:id])
          }
        ]
      end

    ]
  end

  def self.update(view_tab_id, pane_name, pane_data)

    return if view_tab_id.nil? || pane_name.nil?

    find_query = {
      view_tab_id: view_tab_id,
      name: pane_name
    }

    update_query = {
      title: pane_data['title'],
      index_order: pane_data['index_order']
    }

    update_query = find_query.merge(update_query)

    # First try and find a matching record. If there is not one then create one.
    # If there is one then update the record.
    self.where(find_query)
      .first_or_create(update_query)
      .update(update_query)

    # Pull the record that was just updated/created.
    pane = self.where(update_query).first

    # Now loop over the attributes and save if needed.
    if pane_data.key?('attributes') && pane_data['attributes']
      pane_data['attributes'].each do |attribute_name, attribute_data|
        ViewAttribute.update(pane.id, attribute_name, attribute_data)
      end
    end
  end
end
