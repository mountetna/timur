class Pane {
  constructor(pane_name, config, template) {
    this.name = pane_name

    this.title = config.title

    this.display = config.display.map(
      (display_att) => ({
         ...template.attributes[display_att.name],
         ...(display_att.name in template.attributes) && { editable: true },
         ...display_att.attribute
      })
    )
  }
}

var BrowserTab = React.createClass({
  render: function() {
    if (!this.props.tab) return <div>
        <span className="fa fa-spinner fa-pulse"/>
      </div>

    return <div id="tab" className={ this.props.name }>
      {
        Object.keys(this.props.tab.panes).map(
          (pane_name) => {
            return <BrowserPane mode={ this.props.mode }
              pane={ new Pane(pane_name, this.props.tab.panes[pane_name], this.props.template) }
              name={ pane_name }
              revision={ this.props.revision }
              template={ this.props.template }
              document={ this.props.document }
              key={ pane_name }
              />
          }
        )
      }
    </div>
  }
})

module.exports = BrowserTab
