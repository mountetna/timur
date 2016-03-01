var BaseAttribute = {
  render: function() {
    if (this.props.mode == 'browse')
      return this.render_browse();
    else
      return this.render_edit();
  }
}

module.exports = BaseAttribute;
