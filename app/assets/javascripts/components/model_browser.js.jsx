ModelAttributes = React.createClass({
  render: function() {
    return <div id="attributes">
          {
            model.attributes.map(
              function(att) {
                if (att.shown) {
                  return <ModelAttribute key={att.name} attribute={att}/>;
                }
              })
           }
        </div>
  }
});

ModelAttribute = React.createClass({
  render: function() {
    return <div className="attribute">
            <div className="attribute_name">
             { this.props.attribute.display_name }
            </div>
            <div className="attribute_value">
             { this.props.attribute.display_name }
            </div>
           </div>
  }
});

ModelHeader = React.createClass({
  render: function() {
    var button;
    if (this.props.edit_mode)
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
    return { mode: false }
  },
  submit_edit: function() {
    alert('ok');
  },
  handle_mode: function(mode) {
  },
  set_edit_mode: function(enable) {
    this.setState({ edit_mode: enable })
  },
  render: function() {
    return <div id="model_header">
      <ModelHeader edit_mode={ this.state.edit_mode } mode_handler={ this.handle_mode }/>
      <ModelAttributes edit_mode={ this.state.edit_mode }/>
    </div>
  }
});
