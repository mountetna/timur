var BrowserTab = React.createClass({
  render: function() {
    var self = this

    if (!this.props.tab) return <div>
        <span className="fa fa-spinner fa-pulse"/>
      </div>

    return <div id="tab" className={ this.props.name }>
      {
        Object.keys(this.props.tab.panes).map((pane_name) => {
          var pane = this.props.tab.panes[pane_name]

          return <BrowserPane mode={ this.props.mode }
            pane={ pane }
            name={ pane_name }
            revision={ this.props.revision }
            template={ this.props.template }
            document={ this.props.document }
            key={ pane_name }
            />
        })
      }
    </div>
  }
})

module.exports = BrowserTab
