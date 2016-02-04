CollectionUnlink = React.createClass({
  getInitialState: function() {
    return { mode: 'linked' };
  },
  mode_handler: function(mode) {
    var val = {};
    if (mode == 'unlinked')
      val[ this.props.current ] = true;
    else
      val[ this.props.current ] = null;
    this.props.process('form-token-update', { name: this.props.name, value: val });
    this.setState({ mode: mode });
  },
  render: function() {
    if (this.state.mode == 'linked')
      return <div className="collection_item">{ this.props.current } </div>
    else
      return <div className="collection_item"><strike>{ this.props.current }</strike> <span className="button" onClick={ this.mode_handler.bind(null,'linked') }>Re-link</span></div>
  }
});

module.exports = CollectionUnlink;
