
LinkUnlinker = React.createClass({
  render: function() {
    return <div>{ this.props.children } <span className="button" onClick={ this.props.mode_handler.bind(null,'unlink') }>Unlink</span></div>
  }
});



module.exports = LinkUnlinker;
