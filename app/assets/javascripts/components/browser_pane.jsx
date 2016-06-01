var BrowserPane = React.createClass({
  render: function() {
    var self = this
    return <div className="pane">
      {
        this.props.attributes.map(function(att) {
          return <div key={att.name} className="attribute">
            <div className="name" title={ att.desc }>
             { att.display_name }
            </div>
          <AttributeViewer 
            mode={self.props.mode}
            template={ self.props.template }
            document={ self.props.document }
            value={ self.props.value(att.name) }
            revision={ self.props.revision(att.name) }
            attribute={att}/>
          </div>
        })
      }
      </div>
  }
})


module.exports = BrowserPane
