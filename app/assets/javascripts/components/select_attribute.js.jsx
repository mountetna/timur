SelectAttribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit") {
      return <div className="value">
              <Selector 
                className="selection"
                defaultValue={ this.props.value }
                values={ this.props.attribute.options } />
             </div>
    }
    return <div className="value">
            { this.props.value }
           </div>
  }
})

module.exports = SelectAttribute
