LinkAttributeEditor = React.createClass({
  getInitialState: function() {
    if (this.props.value)
      return { mode: 'linked' };
    else
      return { mode: 'create' };
  },
  mode_handler: function(mode) {
    if (mode == 'unlink') {
      this.setState({mode: 'create'});
    }
    else
      this.setState({mode: mode});
  },
  render: function() {
    var link = this.props.value;
    var contents;
    if (this.state.mode == 'linked')
      if (this.props.hide_unlink)
        contents = <div>{ link.identifier } </div>;
      else
        contents = <LinkUnlinker mode_handler={ this.mode_handler }>{ link.identifier }</LinkUnlinker>;
    else {
      contents = <NewLink name={ "ok" }/>
    }
    return <div className="value">
            { contents }
           </div>
  }
})

module.exports = LinkAttributeEditor
