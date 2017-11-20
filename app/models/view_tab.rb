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

    # Pull all the tabs.
    tabs = self.where(project: project_name, model: model_name)
      .order(:index_order)
      .all

    # Return an empty view data object if there are no entries.
    if tabs.empty? 

      return {
        views: Hash[
          model_name,
          {
            project_name: project_name,
            model_name: model_name,
            tabs: {
              default: {
                id: nil,
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
                    attributes: {
                    }
                  }
                }
              }
            }
          }
        ]
      }
    end

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
                  id: tab[:id],
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
end
