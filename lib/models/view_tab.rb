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
        tabs: tabs.sort_by(&:index_order).map(&:to_hash)
      }
    }
  end

  def to_hash
    {
      name: name,
      title: title,
      description: description,
      panes: view_panes.sort_by(&:index_order).map(&:to_hash)
    }
  end
end
