export default class Tab {
  constructor(model_name, record_name, tab_name, config, template) {
    this.name = tab_name
    this.model_name = model_name
    this.record_name = record_name
    this.panes = Object.keys(config.panes).map(
      (pane_name) => new Pane(
        pane_name, 
        config.panes[pane_name],
        template
      )
    )
  }

  requiredAttributes() {
    if (this.panes.some((pane) => !pane.display.length)) return "all"
    return this.panes.map((pane) => pane.display.map((item) => item.attribute.name)).flatten()
  }

  requiredManifests() {
    return this.panes.map((pane) => pane.manifests(this.record_name)).compact().flatten()
  }
}

class Pane {
  constructor(pane_name, config, template) {
    this.name = pane_name

    this.title = config.title

    if (config.display.length)
      this.display = config.display.map(
        (display_item) => new DisplayItem(
          template && template.attributes[display_item.name],
          display_item.attribute
        )
      )
    else if (template)
      this.display = Object.values(template.attributes).map(
        (template_attribute) => template_attribute.shown ? (new DisplayItem(template_attribute)) : null
      ).compact()
    else
      this.display = []
  }

  manifests(record_name) {
    return this.display.map((display_item) => display_item.manifest(record_name)).compact().flatten()
  }
}

class DisplayItem {
  constructor(template_attribute,display_attribute) {
    this.template_attribute = template_attribute
    this.display_attribute = display_attribute
    this.plot = display_attribute && display_attribute.plot
    this.attribute = {
       ...this.template_attribute,
       ...this.template_attribute && { editable: true },
       ...this.display_attribute
    }
  }

  manifest(record_name) {
    if (this.plot) return {
      name: this.plot.name,
      manifest: [
        [ 'record_name', `'${ record_name }'` ],
        ...this.plot.manifest
      ]
    }
  }
}
