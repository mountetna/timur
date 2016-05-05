var Browser = React.createClass({
  componentDidMount: function() {
    var self = this
    this.props.request(function() { self.setState({mode: 'browse'}) })
  },
  getInitialState: function() {
    return { mode: 'loading', can_edit: null }
  },
  header_handler: function(action) {
    var self = this
    switch(action) {
      case 'cancel':
        this.setState({mode: 'browse'})
        this.props.discardRevision()
        return
      case 'approve':
        this.setState({mode: 'submit'})
        this.props.submitRevision(
          this.props.revised_document, 
          function() {
            self.setState({mode: 'browse'})
          },
          function ( messages ) {
            self.setState({mode: 'edit'})
            self.props.showMessage(messages.errors || ["### An unknown error occurred.\n\nSeek further insight elsewhere."] )
          }
        )
        return
      case 'edit':
        this.setState({mode: 'edit'})
        return
    }
  },
  render: function() {
    var self = this
    var token = $( 'meta[name="csrf-token"]' ).attr('content')
    if (this.state.mode == 'loading')
      return <div className="browser">
                <span className="fa fa-spinner fa-pulse"/>
             </div>
    else {
      var skin = this.state.mode == "browse" ?  "browser " + this.props.skin_name : "browser"
      return <div className={ skin }>

        <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ this.props.can_edit }>
          { this.props.template.name }
        </Header>

        <div id="attributes">
        {
          this.props.attributes(this.state.mode).map(function(att) {
            return <div key={att.name} className="attribute">
              <div className="name" title={ att.desc }>
               { att.display_name }
              </div>
            <AttributeViewer 
              mode={self.state.mode}
              template={ self.props.template }
              document={ self.props.document(self.state.mode) }
              value={ self.props.value(self.state.mode, att.name ) }
              revision={ self.props.revision(att.name) }
              attribute={att}/>
            </div>
          })
        }
        </div>
      </div>
    }
  }
})


Browser = connect(
  function (state,props) {
    var template_record = state.templates[props.model_name]

    var template = template_record ? template_record.template : null
    var patched_template = template_record ? template_record.patched_template : null

    var document = template_record ? template_record.documents[props.record_name] : null
    var patched_document = template_record ? template_record.patched_documents[props.record_name] : null

    var revision = (template_record ? template_record.revisions[props.record_name] : null) || {}

    var getDocument = function(mode) {
      return mode == 'browse' ? patched_document : document
    }

    var filterAttributes = function(temp) {
      var atts = []
      if (temp) {
        Object.keys( temp.attributes ).forEach(
          function(att_name) {
            var att = temp.attributes[att_name]
            if (att.shown) atts.push(att)
          }
        )
      }
      return atts
    }

    return $.extend(
      {},
      props,
      {
        template: template,
        skin_name: template ? template.name.toLowerCase() : "",
        document: getDocument,
        revised_document: revision,
        value: function(mode, att_name) {
          return getDocument(mode)[att_name]
        },
        revision: function(att_name) {
          return revision.hasOwnProperty(att_name) ? revision[ att_name ] : document[ att_name ]
        },
        attributes: function(mode) {
          return filterAttributes( mode == "browse" ?  patched_template : template)
        }
      }
    )
  },
  function (dispatch,props) {
    return {
      request: function(success) {
        dispatch(magmaActions.requestTemplateAndDocuments(
          props.model_name,
          [ props.record_name ], 
          success))
      },
      discardRevision: function() {
        dispatch(magmaActions.discardRevision(
          props.record_name,
          props.model_name
        ))
      },
      submitRevision: function(revision,success,error) {
        dispatch(magmaActions.postRevision(
          props.record_name,
          props.model_name,
          revision,
          success,
          error
        ))
      },
      showMessage: function(messages) {
        dispatch(messageActions.showMessages(
          messages))
      }
    }
  }
)(Browser)

Browser.contextTypes = {
  store: React.PropTypes.object
}

module.exports = Browser;
