// The Browser presents views of a record/model. The views are organized into
// tabs/panes.
//
// The Browser should request data for a record/model/tab - this comes with an
// associated payload and any extra data required to draw this tab.
//
// The Browser has state in the form of mode (edit or not) and tab (which one is shown)

import Magma from 'magma'
import BrowserTab from './browser_tab'
import Tab from '../models/tab'
import { discardRevision, sendRevisions } from '../actions/magma_actions'
import { requestView } from '../actions/timur_actions'

var Browser = React.createClass({
  componentDidMount: function() {
    this.props.requestView(this.props.model_name, this.props.record_name, null, () => this.setState({mode: 'browse'}) )
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
    switch(action) {
      case 'cancel':
        this.setState({mode: 'browse'})
        this.props.discardRevision(this.props.record_name, this.props.model_name)
        return
      case 'approve':
        if (this.props.hasRevisions) {
          this.setState({mode: 'submit'})
          this.props.sendRevisions(
            this.props.model_name,
            {
              [this.props.record_name] : this.props.revision
            },
            () => this.setState({mode: 'browse'}),
            () => this.setState({mode: 'edit'})
          )
        } else {
          this.setState({mode: 'browse'})
          this.props.discardRevision(this.props.record_name, this.props.model_name)
        }
        return
      case 'edit':
        this.setState({mode: 'edit'})
        return
    }
  },
  render: function() {
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
          (tab_name) => {
            this.setState({current_tab_name: tab_name})
            if (!view[tab_name]) this.props.requestView(this.props.model_name, this.props.record_name, tab_name)
          }
        }
      />

      <BrowserTab 
        template={this.props.template}
        document={this.props.document}
        revision={this.props.revision}
        mode={ this.state.mode }
        name={ current_tab_name }
        tab={ view[current_tab_name] ? new Tab(
          this.props.model_name,
          this.props.record_name,
          current_tab_name,
          view[current_tab_name],
          this.props.template
        ) : null }
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

    return {
      template,
      document,
      revision,
      view,
      hasRevisions: (Object.keys(revision).length > 0),
    }
  },
  {
    requestView, 
    discardRevision, 
    sendRevisions
  }
)(Browser)

module.exports = Browser
