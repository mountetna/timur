IntegerAttribute = React.createClass({
  filter_keys: function(e) {
    if (Keycode.is_modified(e)) return true;
    if (Keycode.is_number(e)) return true;
    if (Keycode.is_printable(e)) {
      e.preventDefault();
      return true;
    }
    return true;
  },
  render: function() {

    if (this.props.mode == 'edit') {
      return <div className="value">
              <input 
                type='text' 
                className="full_text" 
                placeholder={this.props.attribute.placeholder}
                onKeyDown={ this.filter_keys }
                defaultValue={ this.props.value } />
             </div>
    }

    return <div className="value">
            { this.props.value }
           </div>
  }
})

module.exports = IntegerAttribute
