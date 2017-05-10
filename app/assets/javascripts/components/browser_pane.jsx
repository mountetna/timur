var BrowserPane = React.createClass({
  render: function() {
    var props = this.props
    var display = props.pane.display

    if (display.length == 0)
      return <div style={{display:"none"}}/>
      
    return <div className="pane">
        {
          props.pane.title ? 
            <div className="title" title={ props.name }>
              { props.pane.title }
            </div>
          :
            null
        }
        <div className="attributes">
        {
          display.filter((display_item) => props.mode != 'edit' || display_item.editable()).map((display_item) => {
            var att = display_item.attribute
            var value = props.document[ att.name ]
            var revised_value = att.name in props.revision ?  props.revision[att.name] : props.document[att.name]
            var revised = (props.mode == 'edit' && value != revised_value)

            return <div key={att.name} className="attribute">
              <div className={ revised ? "name revised" : "name" } title={ att.desc }>
               { att.display_name }
              </div>
              <AttributeViewer 
                mode={props.mode}
                template={ props.template }
                document={ props.document }
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

module.exports = BrowserPane
