// The Browser presents views of a record/model. The views are organized into
// tabs/panes.
//
// The Browser should request data for a record/model/tab - this comes with an
// associated payload and any extra data required to draw this tab.
//
// The Browser has state in the form of mode (edit or not) and tab (which one is shown)

var Browser = React.createClass({
  componentDidMount: function() {
    var self = this
    this.props.request(null, function() { self.setState({mode: 'browse'}) })
  },
  getInitialState: function() {
    return { mode: 'loading', can_edit: null, current_tab_name: null }
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

    var view = this.props.view

    if (!view)
      return <div className="browser">
                <span className="fa fa-spinner fa-pulse"/>
             </div>

    var current_tab_name = this.state.current_tab_name || view.default_tab
    
    var skin = this.state.mode == "browse" ?  "browser " + this.props.skin_name : "browser"

    return <div className={ skin }>

      <TabBar selected={ current_tab_name } view={ view }/>

      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ this.props.can_edit }>
        { this.props.template.name }
        <Help info="edit"/>
      </Header>

      <BrowserTab 
        template={this.props.template}
        document={this.props.document}
        mode={ this.state.mode }
        tab={ view.tabs[current_tab_name] }
        />
    </div>
  }
})


Browser = connect(
  function (state,props) {
    var template_record = state.templates[props.model_name]

    var template = template_record ? template_record.template : null

    var document = template_record ? template_record.documents[props.record_name] : null

    var revision = (template_record ? template_record.revisions[props.record_name] : null) || {}

    var view = (template_record ? template_record.views[props.record_name] : null)

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

    return freshen(
      props,
      {
        template: template,
        skin_name: template && template.name ? template.name.toLowerCase() : "",
        document: getDocument,
        revised_document: revision,
        view: view,
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
      request: function(tab_name,success) {
        dispatch(magmaActions.requestView(
          props.model_name,
          props.record_name, 
          tab_name,
          success
        ))
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
