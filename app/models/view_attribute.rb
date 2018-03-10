# Structure of the view:
#
# View
#   Tabs
#     Panes
#       Attributes
#
# Each tab has a list of panes.
# Each pane has a list of attributes.

class ViewAttribute < ActiveRecord::Base
  belongs_to :view_pane

  # Pull all the attributes for a pane.
  def self.retrieve_attributes(pane_id)

    attributes = self.where(view_pane_id: pane_id)
      .order(:index_order)
      .all

    # Return an empty attribute data object if there are no entries.
    if attributes.empty?
      return {}
    end

    # Return the hashed data object.
    return Hash[

      attributes.map do |attribute|
        [
          attribute[:name],
          {
            name: attribute[:name],
            title: attribute[:title],
            attribute_class: attribute[:attribute_class],
            index_order: attribute[:index_order],
            plot_id: attribute[:plot_id],
            manifest_id: attribute[:manifest_id]
          }
        ]
      end

    ]
  end

  def self.update(view_pane_id, attribute_name, attribute_data)

    return if view_pane_id.nil? || attribute_name.nil?

    find_query = {
      view_pane_id: view_pane_id,
      name: attribute_name
    }

    update_query = {
      title: attribute_data['title'],
      attribute_class: attribute_data['attribute_class'],
      index_order: attribute_data['index_order'],
      plot_id: attribute_data['plot_id'],
      manifest_id: attribute_data['manifest_id']
    }

    update_query = find_query.merge(update_query)

    # First try and find a matching record. If there is not one then create one.
    # If there is one then update the record.
    self.where(find_query)
      .first_or_create(update_query)
      .update(update_query)
  end
end
