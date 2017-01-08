var BrowserPane = React.createClass({
  render: function() {
    var self = this

    if (Object.keys(this.props.display_attributes).length == 0)
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
          Object.keys(this.props.display_attributes).map(function(att_name) {
            var att = self.props.display_attributes[att_name]
            var value = self.props.values[ att_name ]
            var revised_value = self.props.revised_values[ att_name ]

            var revised = (self.props.mode == 'edit' && value != revised_value)

            return <div key={att.name} className="attribute">
              <div className={ revised ? "name revised" : "name" } title={ att.desc }>
               { att.display_name }
              </div>
            <AttributeViewer 
              mode={self.props.mode}
              template={ self.props.template }
              document={ self.props.document }
              value={ value }
              revision={ revised_value }
              attribute={att}/>
            </div>
          })
        }
        </div>
      </div>
  }
})

BrowserPane = connect(
  function (state,props) {
    var values = {}
    var display_attributes = {}
    var revised_values = {}
    var pane = props.pane

    console.log("Trying to load this pane:")
    console.log(props)

    // build a hash of values using the 'display' property of
    // the pane, which should tell us what to show
    pane.display.forEach(function(att) {
      if (typeof att === 'string' || att instanceof String) {
        display_attributes[att] = props.template.attributes[att]
        values[att] = props.document[att]
        if (props.mode == 'edit') revised_values[att] = props.revision.hasOwnProperty(att) ? props.revision[att] : props.document[att]
      } else {
        display_attributes[att.name] = att
        values[att.name] = att.data
      }
    })

    return freshen(
      props,
      {
        values: values,
        revised_values: revised_values,
        display_attributes: display_attributes,
      }
    )
  }
)(BrowserPane)

module.exports = BrowserPane
