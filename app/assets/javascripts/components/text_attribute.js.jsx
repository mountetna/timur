var TextAttribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit")
      return <div className="value">
              <textarea className="text_box" 
                defaultValue={ this.props.value } />
             </div>
    return <div className="value">
            { this.props.value }
           </div>
  }
})

module.exports = TextAttribute
