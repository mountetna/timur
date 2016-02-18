var HelpButton = React.createClass({
  render: function() {
    var self = this;
    if (!this.props.helpShown) return <div></div>
    return <div className="help"
      onClick={
        function() {
          self.props.dispatch(messageActions.showMessages(self.props.info));
        }
      } >
        <span className="fa-stack">
          <span className="circle fa fa-circle fa-stack-1x"/>
          <span className="question fa fa-question fa-stack-1x"/>
        </span>
      </div>
  }
});

var Help = connect(
  function (state) {
    return {
      helpShown: state.timur.help_shown
    }
  }
)(HelpButton);

Help.propTypes = {
  info: React.PropTypes.array.isRequired
};

Help.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Help;
