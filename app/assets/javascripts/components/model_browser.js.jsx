
ModelHeader = React.createClass({
  render: function() {
    var button;
    if (this.props.mode == 'edit')
      button = 
        <div className="inline">
          <div id='cancel' onClick={ this.props.mode_handler.bind(null,'browse') }>&#x2717;</div>
          <div id='approve' onClick={ this.props.mode_handler.bind(null,'submit') }>&#x2713;</div>
        </div>
    else
      button = <div id='edit' onClick={ this.props.mode_handler.bind(null,'edit') }>&#x270e;</div>

    return <div id="model_header">
             { model.name }
             { button }
           </div>
  }
});


ModelBrowser = React.createClass({
  getInitialState: function() {
    return { mode: 'browse' }
  },
  submit_edit: function() {
    $('#model').submit()
  },
  handle_mode: function(mode) {
    if (mode == 'submit') {
      // attempt to submit the edit
      this.submit_edit();
    } else
      this.setState({ mode: mode })
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    return <form id="model" method="post" action={ Routes.update_model_path() } encType="multipart/form-data">
      <input type="hidden" name="authenticity_token" value={ token }/>
      <input type="hidden" name="model" value={ model.name }/>
      <input type="hidden" name="record_id" value={ record.id }/>
      <ModelHeader mode={ this.state.mode } mode_handler={ this.handle_mode }/>
      <ModelAttributes mode={ this.state.mode }/>
    </form>
  }
});
