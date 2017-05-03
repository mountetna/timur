// The Browser presents views of a record/model. The views are organized into
// tabs/panes.
//
// The Browser should request data for a record/model/tab - this comes with an
// associated payload and any extra data required to draw this tab.
//
// The Browser has state in the form of mode (edit or not) and tab (which one is shown)

import Magma from 'magma'

var Browser = React.createClass({
  componentDidMount: function() {
    var self = this
    this.props.request(null, function() { self.setState({mode: 'browse'}) })
  },
  getInitialState: function() {
    return { mode: 'loading', current_tab_name: null }
  },
  camelize: function(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return letter.toUpperCase()
    }).replace(/\s+/g, '')
  },
  header_handler: function(action) {
    var self = this
    switch(action) {
      case 'cancel':
        this.setState({mode: 'browse'})
        this.props.discardRevision()
        return
      case 'approve':
        if (this.props.hasRevisions) {
          this.setState({mode: 'submit'})
          this.props.submitRevision(
            this.props.revision, 
            () => self.setState({mode: 'browse'}),
            () => self.setState({mode: 'edit'})
          )
        } else {
          this.setState({mode: 'browse'})
          this.props.discardRevision()
        }
        return
      case 'edit':
        this.setState({mode: 'edit'})
        return
    }
  },
  render: function() {
    var self = this

    var view = this.props.view

    if (!view || !this.props.template || !this.props.document)
      return <div className="browser">
                <span className="fa fa-spinner fa-pulse"/>
             </div>

    var current_tab_name = this.state.current_tab_name || Object.keys(view)[0]
    
    var skin = this.state.mode == "browse" ?  "browser " + this.props.model_name : "browser"

    return <div className={ skin }>

      <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ this.props.can_edit }>
        <div className="model_name">
        { this.camelize(this.props.model_name) }
        </div>
        <div className="record_name">
        { this.props.record_name }
        </div>
        <Help info="edit"/>
      </Header>

      <TabBar mode={this.state.mode} revision={ this.props.revision } current_tab_name={ current_tab_name } view={ view }
        clickTab={
          function(tab_name) {
            self.setState({current_tab_name: tab_name})
            if (!view[tab_name]) self.props.request(tab_name)
          }
        }
      />

      <BrowserTab 
        template={this.props.template}
        document={this.props.document}
        revision={this.props.revision}
        mode={ this.state.mode }
        name={ current_tab_name }
        tab={ view[current_tab_name] }
        />
    </div>
  }
})

Browser = connect(
  function (state,props) {
    var magma = new Magma(state)

    var template = magma.template(props.model_name)
    var document = magma.document(props.model_name, props.record_name)
    var revision = magma.revision(props.model_name, props.record_name) || {}

    var view = (state.timur.views ? state.timur.views[props.model_name] : null)

    return freshen(
      props,
      {
        template: template,
        document: document,
        record_name: template && document ? document[ template.identifier ] : null,
        revision: revision,
        hasRevisions: (Object.keys(revision).length > 0),
        view: view,
      }
    )
  },
  function (dispatch,props) {
    return {
      request: function(tab_name,success,error) {
        dispatch(timurActions.requestView(
          props.model_name,
          props.record_name,
          tab_name,
          success,
          error
        ))
      },
      discardRevision: function() {
        dispatch(magmaActions.discardRevision(
          props.record_name,
          props.model_name
        ))
      },
      submitRevision: function(revision,success,error) {
        var revisions = {}
        revisions[props.record_name] = revision
        dispatch(magmaActions.postRevisions(
          props.model_name,
          revisions,
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
