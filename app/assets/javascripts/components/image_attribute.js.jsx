var ImageAttribute = React.createClass({
  render: function() {
    if (this.props.mode == "edit") {
      return <div className="value">
               <input type="file" name={ this.value_name() } />
             </div>
    }

    if (this.props.value)
      return <div className="value">
              <a href={ this.props.value.url } >
                <img src={ this.props.value.thumb }/></a>
             </div>
    else
      return <div className="value">
              <div className="document_empty">No file.</div>
             </div>
  }
})

module.exports = ImageAttribute;
