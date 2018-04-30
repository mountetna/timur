class ViewTab < Sequel::Model
  one_to_many :view_panes, order: :index_order

  def self.retrieve_view(project_name, model_name)
    # Pull all the tabs.
    tabs = self.where(project: project_name, model: model_name)
      .order(:index_order)
      .all

    # Return an empty view data object if there are no entries.
    return generate_default_tab(project_name, model_name) if tabs.empty?

    # Return the hashed data object.
    return {
      views: {
        model_name => {
          model_name: model_name,
          project_name: project_name,
          tabs: Hash[
            tabs.map do |tab|
              [
                tab.name,
                tab.to_hash
              ]
            end
          ]
        }
      }
    }
  end

  def to_hash
    {
      id: id,
      name: name,
      title: title,
      description: description,
      index_order: index_order,
      panes: Hash[view_panes.map { |p| [ p.name, p.to_hash ] }]
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
end
