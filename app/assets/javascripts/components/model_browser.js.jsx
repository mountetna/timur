ModelNames = React.createClass({
  render: function() {
    return <div id="names">
      { model.attributes.map(function(att) {
          }
        </div>
  }
});

ModelEditButton = React.createClass({
  render: function() {
    if (this.props.edit_mode)
      return <div className="inline">
        <div id='cancel' onClick={ this.props.set_edit_mode.bind(null,false) }>&#x2717;</div>
        <div id='approve' onClick={ this.props.submit_edit.bind(null) }>&#x2713;</div>
      </div>
    else
      return <div id='edit' onClick={ this.props.set_edit_mode.bind(null,true) }>&#x270e;</div>
  }
});

ModelValues = React.createClass({
  render: function() {
    return <div id="values"/>
  }
});

ModelBrowser = React.createClass({
  getInitialState: function() {
    return { edit_mode: false }
  },
  submit_edit: function() {
    alert('ok');
  },
  set_edit_mode: function(enable) {
    this.setState({ edit_mode: enable })
  },
  render: function() {
    return <div id="model_header">
      { model.name }
      <ModelEditButton submit_edit={ this.submit_edit} edit_mode={ this.state.edit_mode } set_edit_mode={ this.set_edit_mode }/>
      <ModelNames/>
      <ModelValues mode={ this.state.edit_mode }/>
    </div>
  }
});
