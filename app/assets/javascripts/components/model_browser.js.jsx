ModelErrors = React.createClass({
  render: function() {
    if (this.props.errors.length > 0) {
      return <div id="error_box">
              {
                this.props.errors.map(function(error, i) {
                  return <div key={i} className="error">&gt; { error }</div>;
                })
              }
             </div>;
    } else
      return <div className="error_box"></div>;
  }
});

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
             { this.props.model.name }
             { button }
           </div>
  }
});

ModelBrowser = React.createClass({
  getInitialState: function() {
    return { mode: 'loading', errors: [] }
  },
  submit_edit: function() {
    $('#model').submit();
  },
  post_form:    function() {
    var submission = new FormData($('#model')[0])
    // we need to fix some entries in our submission.
    this.update_form_tokens(submission);
    console.log("Posting via AJAX");
    console.log(submission);
    $.ajax({
      type: "POST",
      url: $('#model').attr('action'), //sumbits it to the given url of the form
      data: submission,
      dataType: "JSON",
      success: this.data_update,
      error: this.report_errors,
      cache: false,
      contentType: false,
      processData: false
    });
    return false;
  },
  report_errors: function(result) {
    result = result.responseJSON;
    console.log("Got an error");
    console.log(result);
    if (result && result.errors)
      this.setState( { errors: result.errors } );
    else
      this.setState( { errors: [ "An unknown error occurred." ] } );
  },
  data_update:  function(result) {
    this.setState( { mode: 'browse', record: result.record, model: result.model, errors: [] } );
  },
  update_form_tokens: function(submission) {
    for (var key in self.form_tokens) {
      submission.append(key, self.form_tokens[key]);
    }
  },
  handle_mode: function(mode) {
    if (mode == 'submit') {
      // attempt to submit the edit
      this.submit_edit();
    } else
      this.setState({ mode: mode })
  },
  componentDidMount: function() {
    var self = this;
    $.get(this.props.source, function(result) {
      self.data_update(result);
      $('#model').submit(self.post_form);
    });
  },
  get_data: function(data) {
    $.get(this.props.source, data, this.data_update);
  },
  process: function( job, item ) {
    // general workhorse function that handles stuff from the components
    console.log(item);
    switch(job) {
      case 'form-token-update':
        if (!this.form_tokens) this.form_tokens = {};
        this.form_tokens[ item.name ] = item.value;
        break;
      case 'request-extension':
        this.get_data( { extensions: [ item ] } );
    };
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    if (this.state.mode == 'loading')
      return <div id="model"/>;
    else
      return <form id="model" method="post" model={ this.state.model } record={ this.state.record } action={ Routes.update_model_path() } encType="multipart/form-data">
        <input type="hidden" name="authenticity_token" value={ token }/>
        <input type="hidden" name="model" value={ this.state.model.name }/>
        <input type="hidden" name="record_id" value={ this.state.record.id }/>
        <ModelErrors errors={ this.state.errors }/>
        <ModelHeader mode={ this.state.mode } model={ this.state.model } mode_handler={ this.handle_mode }/>
        <ModelAttributes mode={ this.state.mode } model={ this.state.model } record={ this.state.record } process={ this.process }/>
      </form>
  }
});
