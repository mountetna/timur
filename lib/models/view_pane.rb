class ViewPane < Sequel::Model
  many_to_one :view_tab
  one_to_many :view_attributes, order: :index_order

  def self.build_view(model_name, project_name, load_tab_name)
    # first collect all of the panes matching this thing
    panes = self.where(
      view_model_name: model_name, project_name: project_name
    ).order(:created_at).all

    if panes.empty?
      return {
        tabs: {
          default: {
            panes: {
              default: {
                title: nil,
                display: []
              }
            }
          }
        },
        tab_name: 'default'
      }
    end

    load_tab_name ||= panes.first.tab_name
    tabs = panes.group_by(&:tab_name)

    return {
      tabs: Hash[
        tabs.map do |tab_name, panes|
          if (tab_name != load_tab_name.to_s)
            next [ tab_name, nil ]
          end
          [
            tab_name, {
              panes: Hash[
                panes.map do |pane|
                  [
                    pane.name,
                    pane.to_hash
                  ]
                end
              ]
            }
          ]
        end
      ],
      tab_name: load_tab_name
    }
  end

  def to_hash
    {
      id: id,
      name: name,
      title: title,
      description: description,
      index_order: index_order,
      attributes: Hash[ view_attributes.map{|a| [ a.name, a.to_hash ] } ]
    }
  end
end
