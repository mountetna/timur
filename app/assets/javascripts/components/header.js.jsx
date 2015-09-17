Header = React.createClass({
  close_button: function() {
    if (this.props.can_close) {
      return <div className='close' onClick={ this.props.handler.bind(null,'close') } className="close">&#x274c;</div>
    }
  },
  edit_state_button: function() {
    if (this.props.mode == 'edit')
      return <div className="inline">
          <div className='cancel' onClick={ this.props.handler.bind(null,'cancel') }>&#x2717;</div>
          <div className='approve' onClick={ this.props.handler.bind(null,'approve') }>&#x2713;</div>
        </div>
    else if (this.props.mode == 'submit')
      return <div className='submit'>&#x231b;</div>
    else if (this.props.can_edit)
      return <div className='edit' onClick={ this.props.handler.bind(null,'edit') }>&#x270e;</div>
  },
  render: function() {
    return <div className="header">
             { this.props.children }
             { this.edit_state_button() }
             { this.close_button() }
           </div>
  }
});
