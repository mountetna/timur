// this is a single div that will format a document to display the
// value for a single attribute

Attribute = React.createClass({
  render: function() {

    if (this.props.mode == "edit")
      return <div className="value">
              <input type='text' className="full_text" 
                placeholder={ this.props.attribute.placeholder }
                defaultValue={ this.props.value } />
             </div>

    return <div className="value">
            { this.props.value }
           </div>
  }
})

module.exports = Attribute;
