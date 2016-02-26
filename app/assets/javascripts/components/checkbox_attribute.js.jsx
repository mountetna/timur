CheckboxAttribute = React.createClass({
  render: function() {
    return <div className="value">
            { this.props.value ? "yes" : "no" }
           </div>
    return <div className="value">
            <input type="checkbox" className="text_box" 
              defaultChecked={ this.props.value } />
           </div>
  }
})

module.exports = CheckboxAttribute;
