var BrowserTab = React.createClass({
  render: function() {
    var self = this

    if (!this.props.tab) return <div>
        <span className="fa fa-spinner fa-pulse"/>
      </div>

    return <div id="tab" className={ this.props.name }>
      {
        Object.keys(this.props.tab.panes).map(function(pane_name) {
          var pane = self.props.tab.panes[pane_name]

          return <BrowserPane mode={ self.props.mode }
            pane={ pane }
            name={ pane_name }
            revision={ self.props.revision }
            template={ self.props.template }
            document={ self.props.document }
            key={ pane_name }
            />
        })
      }
    </div>
  }
})

module.exports = BrowserTab
