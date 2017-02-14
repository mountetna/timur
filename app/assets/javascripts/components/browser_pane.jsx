var BrowserPane = React.createClass({
  render: function() {
    var self = this

    if (this.props.display.length == 0)
      return <div style={{display:"none"}}/>
      
    return <div className="pane">
        {
          this.props.pane.title ? 
            <div className="title" title={ this.props.name }>
              { this.props.pane.title }
            </div>
          :
            null
        }
        <div className="attributes">
        {
          this.props.display.map(function(att) {
            var att_name = att.name
            var value = self.props.document[ att_name ]
            var revised_value = self.props.revision.hasOwnProperty(att_name) ? self.props.revision[att_name] : self.props.document[att_name]
            var revised = (self.props.mode == 'edit' && value != revised_value)

            return <div key={att_name} className="attribute">
              <div className={ revised ? "name revised" : "name" } title={ att.desc }>
               { att.display_name }
              </div>
            <AttributeViewer 
              mode={self.props.mode}
              template={ self.props.template }
              document={ self.props.document }
              value={ value }
              revision={ revised_value }
              attribute={ att }/>
            </div>
          })
        }
        </div>
      </div>
  }
})

BrowserPane = connect(
  function (state,props) {
    return freshen(
      props,
      {
        display: props.pane.display.map(function(display_att) {
          return freshen(
            props.template.attributes[display_att.name],
            props.template.attributes.hasOwnProperty(display_att.name) ? { editable: true } : null,
            display_att.overrides
          )
        })
      }
    )
  }
)(BrowserPane)

module.exports = BrowserPane
