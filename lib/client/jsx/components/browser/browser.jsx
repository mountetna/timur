/*
 * The Browser presents views of a record/model. The views are organized into
 * tabs/panes.
 * 
 * The Browser should request data for a record/model/tab - this comes with an
 * associated payload and any extra data required to draw this tab.
 * 
 * The Browser has state in the form of mode (edit or not) and tab (which one is
 * shown).
 */

// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

// Class imports.
import Header from '../header';
import {TabBarContainer as TabBar} from '../tab_bar';
import BrowserTab from './browser_tab';

// Module imports.
import { requestManifests } from '../../actions/manifest_actions';
import { requestPlots } from '../../actions/plot_actions';
import { setLocation } from '../../actions/location_actions';
import { requestView } from '../../actions/view_actions';
import {
  sendRevisions, discardRevision, requestDocuments, requestAnswer
} from '../../actions/magma_actions';
import {
  interleaveAttributes,
  getAttributes,
  getDefaultTab,
  selectView
} from '../../selectors/tab_selector';
import {
  selectTemplate, selectDocument, selectRevision
} from '../../selectors/magma';
import { selectUserProjectRole } from '../../selectors/user_selector';

class Browser extends React.Component{
  constructor(props){
    super(props);

    this.state = { mode: 'loading' };
  }

  componentDidMount(){
    let { requestManifests, requestPlots } = this.props;

    requestManifests();
    requestPlots();
    this.requestData();
  }

  requestData() {
    let {
      model_name, record_name, view, tab_name,
      setLocation, requestAnswer, requestView
    } = this.props;

    if (!model_name && !record_name) {
      // ask magma for the project name
      requestAnswer(
        { query: [ 'project', '::first', '::identifier' ] },

        // redirect there
        ({answer}) => setLocation(
          Routes.browse_model_path(
            TIMUR_CONFIG.project_name,
            'project',
            answer
          )
        )
      );
    } else if (!view) {
      // we are told the model and record name, get the view
      requestView(
        model_name,
        this.selectOrShowTab.bind(this)
      )
    } else if (!tab_name) {
      this.selectDefaultTab(view);
    } else {
      this.showTab();
    }
  }

  showTab() {
    let { view, tab_name } = this.props;

    this.requestTabDocuments(view.tabs[tab_name]);
    this.browseMode();
  }

  selectOrShowTab(view) {
    let { tab_name } = this.props;
    if (tab_name)
      this.showTab();
    else
      this.selectDefaultTab(view);
  }

  selectDefaultTab(view) {
    this.selectTab(getDefaultTab(view));
  }

  selectTab(tab_name) {
    let { setLocation } = this.props;
    setLocation(window.location.href.replace(/#.*/,'') + `#${ tab_name }`);
  }

  requestTabDocuments(tab) {
    if (!tab) return;

    let { requestDocuments, model_name, record_name, record, template } = this.props;
    let exchange_name = `tab ${tab.name} for ${model_name} ${record_name}`;

    let attribute_names = getAttributes(tab);

    let hasAttributes = record && template && Array.isArray(attribute_names) && attribute_names.every(
      attr_name => !(attr_name in template.attributes) || (attr_name in record)
    );

    // ensure attribute data is present in the document
    if (!hasAttributes) {
      // or else make a new request
      requestDocuments({
        model_name, record_names: [record_name],
        attribute_names,
        exchange_name,
        success: this.browseMode.bind(this)
      });
    }
  }

  camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index){
      return letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

  setMode(mode) { this.setState({mode}) }
  editMode() { this.setMode('edit') }
  browseMode() { this.setMode('browse') }

  cancelEdits() {
    let { discardRevision, record_name, model_name } = this.props;

    this.browseMode();
    discardRevision(
      record_name,
      model_name
    );
  }

  postEdits() {
    let { revision, model_name, record_name, sendRevisions } = this.props;
    this.setMode('submit');
    sendRevisions(
      model_name,
      {[record_name] : revision},
      this.browseMode.bind(this),
      this.editMode.bind(this)
    );
  }

  approveEdits() {
    let { revision, model_name, record_name, sendRevisions } = this.props;
    if (Object.keys(revision).length > 0) this.postEdits();
    else this.cancelEdits();
  }

  renderEmptyView(){
    return(
      <div className='browser'>
        <div id='loader-container'>
          <div className='loader'>
            {'Loading...'}
          </div>
        </div>
      </div>
    );
  }

  render(){
    let {mode} = this.state;
    let {role, revision, view, template, record, model_name, record_name, tab_name} = this.props;
    let can_edit = role == 'administrator' || role == 'editor';

    // Render an empty view if there is no view data yet.
    if(!view || !template || !record || !tab_name) return this.renderEmptyView();

    let tab = interleaveAttributes(
      view.tabs[tab_name],
      template
    );

    // Set at 'skin' on the browser styling.
    let skin = 'browser';
    if(mode == 'browse') skin = 'browser '+model_name;

    return(
      <div className={skin}>
        <Header
          onEdit={ mode == 'browse' && can_edit && this.editMode.bind(this) }
          onSave={mode == 'edit' && this.approveEdits.bind(this) }
          onCancel={ mode == 'edit' && this.cancelEdits.bind(this) }
          onLoad={mode=='submit'}>
          <div className='model-name'>
            {this.camelize(model_name)}
          </div>
          <div className='record-name'>
            {record_name}
          </div>
        </Header>
        <TabBar
          mode={mode}
          revision={revision}
          view={view}
          current_tab={tab_name}
          onClick={this.selectTab.bind(this)}
        />
        <BrowserTab {
            ...{ model_name, record_name, template, record, revision, mode, tab }
          } />
      </div>
    );
  }
}

export default connect(
  // map state
  (state = {}, {model_name, record_name})=>{
    let template = selectTemplate(state,model_name);
    let record = selectDocument(state, model_name, record_name);
    let revision = selectRevision(state, model_name, record_name) || {};
    let view = selectView(state, model_name);
    let role = selectUserProjectRole(state);

    return {
      template,
      revision,
      view,
      record,
      role
    };
  },
  // map dispatch
  {
    requestPlots, requestManifests, requestView, requestAnswer,
    requestDocuments, discardRevision, sendRevisions, setLocation
  }
)(Browser);
