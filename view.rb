module View
  class << self
    def create_view(view)
      destroy_old_views(view[:project], view[:model])
      view[:tabs].each.with_index do |tab,i|
        create_tab(tab, view[:project], view[:model],i)
      end
    end

    def destroy_old_views(project, model)
      tabs = ViewTab.where(project: project, model: model).all
      panes = ViewPane.where(view_tab_id: tabs.map(&:id)).all
      attributes = ViewAttribute.where(view_pane_id: panes.map(&:id)).all

      ViewAttribute.where(id: attributes.map(&:id)).destroy
      ViewPane.where(id: panes.map(&:id)).destroy
      ViewTab.where(id: tabs.map(&:id)).destroy
    end

    def create_tab(tab_config, project, model, index_order)
      tab = ViewTab.create(
        tab_config.slice(:name, :title, :description).merge(
          project: project,
          model: model,
          index_order: index_order,
          created_at: Time.now,
          updated_at: Time.now
        )
      )

      tab_config[:panes].each.with_index do |pane_config,i|
        create_pane(pane_config, tab, i)
      end
    end

    def create_pane(pane_config, tab, index_order)
      pane = ViewPane.create(
        pane_config.slice(:name, :title).merge(
          view_tab: tab,
          index_order: index_order,
          created_at: Time.now,
          updated_at: Time.now
        )
      )

      pane_config[:attributes].each.with_index do |att_config,i|
        create_attribute(att_config, pane, i)
      end
    end

    def create_attribute(att_config, pane, index_order)
      att = ViewAttribute.create(
        att_config.slice(:name, :attribute_class).merge(
          view_pane: pane,
          index_order: index_order,
          created_at: Time.now,
          updated_at: Time.now
        )
      )
    end
  end
end
