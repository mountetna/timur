
LinkAttributeEditor = React.createClass({
  mixins: [ AttributeHelpers ],
  getInitialState: function() {
    if (this.attribute_exists())
      return { mode: 'linked' };
    else
      return { mode: 'create' };
  },
  mode_handler: function(mode) {
    if (mode == 'unlink') {
      this.setState({mode: 'create'});
      this.props.process('form-token-update', { name: this.unlink_name(), value: true });
    }
    else
      this.setState({mode: mode});
  },
  render: function() {
    var link = this.attribute_value();
    var contents;
    if (this.state.mode == 'linked')
      if (this.props.hide_unlink)
        contents = <div>{ link.identifier } </div>;
      else
        contents = <LinkUnlinker mode_handler={ this.mode_handler }>{ link.identifier }</LinkUnlinker>;
    else {
      contents = <NewLink name={ this.link_name() }/>
    }
    return <div className="value">
            { contents }
           </div>
  }
});

module.exports = LinkAttributeEditor;
