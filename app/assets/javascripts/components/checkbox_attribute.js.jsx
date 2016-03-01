var CheckboxAttribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit") {
      return <div className="value">
              <input type="checkbox" className="text_box" 
                defaultChecked={ this.props.value } />
             </div>
    }
    return <div className="value"> { this.props.value ? "yes" : "no" } </div>
  }
})

module.exports = CheckboxAttribute
