Header = React.createClass({
  close_button: function() {
    if (this.props.can_close) {
      return <div onClick={ this.props.handler.bind(null,'close') } className="close">
        <span className="fa fa-times-circle"/>
      </div>
    }
  },
  edit_state_button: function() {
    if (this.props.mode == 'edit')
      return <div className="inline">
          <div className='cancel' onClick={ this.props.handler.bind(null,'cancel') }>
          <span className="fa fa-close"/>
          </div>
          <div className='approve' onClick={ this.props.handler.bind(null,'approve') }>
          <span className="fa fa-check"/>
          </div>
        </div>
    else if (this.props.mode == 'submit')
      return <div className='submit'><span className="fa fa-spinner fa-pulse"/></div>
    else if (this.props.can_edit)
      return <div className='edit' onClick={ this.props.handler.bind(null,'edit') }>
        <span className="fa fa-pencil"/>
        </div>
  },
  render: function() {
    return <div className="header">
             { this.props.children }
             { this.edit_state_button() }
             { this.close_button() }
           </div>
  }
});

module.exports = Header;
