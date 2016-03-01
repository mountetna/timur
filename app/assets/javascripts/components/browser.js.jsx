var BrowserDisplay = React.createClass({
  componentDidMount: function() {
    var self = this;
    this.props.request(function() { self.setState({mode: 'browse'}) })
  },
  getInitialState: function() {
    return { mode: 'loading', can_edit: null }
  },
  update_form: function() {
    var node = $(React.findDOMNode(this));
    var submission = new FormData(node[0])
    // we need to fix some entries in our submission.
    this.update_form_tokens(submission);
    $.ajax({
      type: "POST",
      url: node.attr('action'), //sumbits it to the given url of the form
      data: submission,
      dataType: "JSON",
      success: this.data_update,
      error: this.update_errors,
      cache: false,
      contentType: false,
      processData: false
    });
    return false;
  },
  update_errors: function(result) {
    var store = this.context.store;
    result = result.responseJSON;
    this.handle_mode( 'edit' );
    if (result && result.errors)
      this.props.showMessage(results.errors);
    else
      this.props.showMessage( ["### An unknown error occurred."] );
  },
  header_handler: function(action) {
    switch(action) {
      case 'cancel':
        this.setState({mode: 'browse'})
        self.form_tokens = {};
        return
      case 'approve':
        this.setState({mode: 'submit'})
        this.submit_edit()
        return
      case 'edit':
        console.log('setting state to edit')
        this.setState({mode: 'edit'})
        return
    }
  },
  skin: function() {
    if (this.state.mode == "browse") {
      var set = this.props.template.skin || [];
      return set.concat(['browser']).join(' ');
    } else
      return 'browser';
  },
  render: function() {
    var self = this
    var token = $( 'meta[name="csrf-token"]' ).attr('content')
    if (this.state.mode == 'loading')
      return <div className={ this.skin() }/>
    else {
      return <div className={ this.skin() }>

        <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true }>
          { this.props.template.name }
        </Header>

        <div id="attributes">
        {
          self.props.displayed_attributes.map(function(att) {
            return <AttributeRow 
              key={att.name}
              mode={self.state.mode}
              template={ self.props.template }
              document={ self.props.document }
              value={ self.props.document[ att.name ] }
              attribute={att}/>;
          })
        }
        </div>
      </div>
    }
  }
});

var Browser = connect(
  function (state,props) {
    var template = state.templates[props.model_name];
    var document = template ? template.documents[props.record_name] : null
    var atts = []
    if (template) {
      Object.keys( template.attributes ).forEach(
        function(att_name) {
          var att = template.attributes[att_name]
          if (att.shown) atts.push(att)
        }
      )
    }
    return $.extend(
      {},
      props,
      {
        template: template,
        document: document,
        displayed_attributes: atts
      }
    );
  },
  function (dispatch,props) {
    return {
      request: function(success) {
        dispatch(magmaActions.requestTemplateAndDocuments(
          props.model_name,
          [ props.record_name ], 
          success))
      },
      showMessage: function(messages) {
        dispatch(messageActions.showMessages(
          messages))
      }
    }
  }
)(BrowserDisplay);

Browser.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Browser;
