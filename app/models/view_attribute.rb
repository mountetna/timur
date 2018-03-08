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
            id: attribute[:id],
            name: attribute[:name],
            title: attribute[:title],
            description: attribute[:description],
            attribute_class: attribute[:attribute_class],
            index_order: attribute[:index_order],
            plot_id: attribute[:plot_id],
            manifest_id: attribute[:manifest_id]
          }
        ]
      end

    ]
  end
end
