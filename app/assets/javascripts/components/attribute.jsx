// this is a single div that will format a document to display the
// value for a single attribute

Attribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit") {
      return <div className="value">
              <input type='text' className="full_text" 
                placeholder={ this.props.attribute.placeholder }
                onChange={ function(e) {
                  var text = e.target.value
                  var revision = { }
                  revision[ this.props.attribute.name ] = text
                  magmaActions.reviseDocument(this.props.template.name,
                                              this.props.document.name,
                                             revision)
                } }
                defaultValue={ this.props.value } />
             </div>
    }

    return <div className="value">
            { this.props.value }
           </div>
  }
})

module.exports = Attribute;
