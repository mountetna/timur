BrowserHeader = React.createClass({
  render: function() {
    var button;
    if (this.props.mode == 'edit')
      button = <div className="inline">
          <div id='cancel' onClick={ this.props.mode_handler.bind(null,'browse') }>&#x2717;</div>
          <div id='approve' onClick={ this.props.mode_handler.bind(null,'submit') }>&#x2713;</div>
        </div>
    else if (this.props.mode == 'submit')
      button = <div id='submit'>&#x231b;</div>
    else if (this.props.editable)
      button = <div id='edit' onClick={ this.props.mode_handler.bind(null,'edit') }>&#x270e;</div>

    return <div className="model_header">
             { this.props.model.name }
             { button }
           </div>
  }
});
