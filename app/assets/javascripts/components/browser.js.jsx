var BrowserDisplay = React.createClass({
  componentDidMount: function() {
    var self = this;

    this.props.request(function() {
        console.log("Setting mode to browse");
        self.setState({mode: 'browse'})
      })
  },
  getInitialState: function() {
    return { mode: 'loading', can_edit: null }
  },
  submit_edit: function() {
    this.update_form();
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
  update_form_tokens: function(submission) {
    for (var key in this.form_tokens) {
      var token = this.form_tokens[key];
      if (token.constructor == Object)
        token = Object.keys(token).filter(function(k) {
          return token[k];
        });
      submission.append(key, token);
    }
  },
  header_handler: function(action) {
    if (action == 'cancel') this.handle_mode('browse');
    else if (action == 'approve') this.handle_mode('submit');
    else if (action == 'edit') this.handle_mode('edit');
  },
  handle_mode: function(mode,opts) {
    var self = this;
    var handler = {
      submit: function() {
        self.submit_edit();
      },
      browse: function() {
        self.form_tokens = {};
      }
    }
    if (handler[mode]) handler[mode]();
    this.setState( $.extend({ mode: mode }, opts) );
  },
  get_data: function(data) {
    $.get(this.props.source, data, this.data_update);
  },
  process: function( job, item ) {
    // general workhorse function that handles stuff from the components
    switch(job) {
      case 'form-token-update':
        if (!this.form_tokens) this.form_tokens = {};
        if (item.value == null)
          delete this.form_tokens[ item.name ];
        else if (item.value.constructor == Object)
          this.form_tokens[ item.name ] = $.extend(this.form_tokens[ item.name ], item.value);
        else
          this.form_tokens[ item.name ] = item.value;
        break;
    };
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
              mode={self.props.mode}
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
