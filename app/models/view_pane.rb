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
          id: nil,
          name: 'default',
          title: '',
          description: '',
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
            id: pane[:id],
            name: pane[:name],
            title: pane[:title],
            description: pane[:description],
            index_order: pane[:index_order],
            attributes: ViewAttribute.retrieve_attributes(pane[:id])
          }
        ]
      end

    ]
  end
end
