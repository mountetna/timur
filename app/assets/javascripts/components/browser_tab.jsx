var BrowserTab = React.createClass({
  render: function() {
    var self = this

    if (!this.props.tab) return <div style={{display: "none"}}/>;

    return <div id="tab">
      {
        this.props.tab.panes.map(function(pane) {
          <BrowserPane mode={ self.props.mode }
            pane={ pane }
            template={ self.props.template }
            document={ self.props.document }
            key={ pane.name }
            />
        })
      }
    </div>
  }
})
