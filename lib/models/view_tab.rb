class ViewTab < Sequel::Model
  one_to_many :view_panes, order: :index_order

  def self.retrieve_view(project_name, model_name)
    # Pull all the tabs.
    tabs = self.where(project: project_name, model: model_name)
      .order(:index_order)
      .all

    # Return the hashed data object.
    return {
      view: {
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
end
