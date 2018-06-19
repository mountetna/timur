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
import Magma from '../../magma';
import Header from '../header';
import {HelpContainer as Help} from '../help';
import {TabBarContainer as TabBar} from '../tab_bar';
import BrowserTab from './browser_tab';

// Module imports.
import { requestManifests } from '../../actions/manifest_actions';
import { requestPlots } from '../../actions/plot_actions';
import { setLocation } from '../../actions/location_actions';
import { requestView } from '../../actions/timur_actions';
import {
  sendRevisions, discardRevision, requestDocuments, requestAnswer
} from '../../actions/magma_actions';
import {
  interleaveAttributes,
  getTabByIndexOrder,
  getAttributes,
  selectView
} from '../../selectors/tab_selector';

export class Browser extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      mode: 'loading',
      current_tab_index: 0
    };
  }

  componentDidMount(){
    let { requestManifests, requestPlots } = this.props;

    requestManifests();
    requestPlots();
    this.requestData();
  }

  requestData() {
    let {
      model_name, record_name, view,
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
        model_name, record_name, 'overview', this.requestViewDocuments.bind(this, 'overview')
      )
    } else {
      this.browseMode();
    }
  }

  requestViewDocuments(tab_name,response) {
    let { view } = response;
    if (!tab_name in view.tabs) tab_name = 'default';
    this.requestTabDocuments(view.tabs[tab_name])
  }

  requestTabDocuments(tab) {
    if (!tab) return;

    let { requestDocuments, model_name, record_name, doc, template } = this.props;
    let exchange_name = `tab ${tab.name} for ${model_name} ${record_name}`;

    let attribute_names = getAttributes(tab);

    let hasAttributes = doc && template && Array.isArray(attribute_names) && attribute_names.every(
      attr_name => !(attr_name in template.attributes) || (attr_name in doc)
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

  selectTab(index_order) {
    let {requestDocuments, model_name, record_name, view, doc} = this.props;

    // Set the new requested tab state.
    this.setState({current_tab_index: index_order});

    this.requestTabDocuments(
      getTabByIndexOrder(view, index_order)
    )
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
    let {mode, current_tab_index} = this.state;
    let {can_edit, revision, view, template, doc, model_name, record_name} = this.props;

    // Render an empty view if there is no view data yet.
    if(!view || !template || !doc) return this.renderEmptyView();

    // Select the current tab data from by the 'current_tab_index'.
    let tab = interleaveAttributes(
      getTabByIndexOrder(view, current_tab_index),
      template
    );

    // Set at 'skin' on the browser styling.
    let skin = 'browser';
    if(mode == 'browse') skin = 'browser '+model_name;

    return(
      <div className={skin}>
        <Header
          onEdit={ mode == 'browse' && can_edit && this.editMode.bind(this) }
          onApprove={mode == 'edit' && this.approveEdits.bind(this) }
          onCancel={ mode == 'edit' && this.cancelEdits.bind(this) }
          onLoad={mode=='submit'}>
          <div className='model-name'>
            {this.camelize(model_name)}
          </div>
          <div className='record-name'>
            {record_name}
          </div>
          <Help info='edit' />
        </Header>
        <TabBar
          mode={mode}
          revision={revision}
          view={view}
          current_tab_index={current_tab_index}
          onClick={this.selectTab.bind(this)}
        />
        <BrowserTab {
            ...{ template, doc, revision, mode, tab }
          } />
      </div>
    );
  }
}



export const BrowserContainer = connect(
  // map state
  (state = {}, {model_name, record_name})=>{
    let magma = new Magma(state);
    let template = magma.template(model_name);
    let doc = magma.document(model_name, record_name);
    let revision = magma.revision(model_name, record_name) || {};
    let view = selectView(state, model_name);

    return {
      template,
      revision,
      view,
      doc
    };
  },
  // map dispatch
  {
    requestPlots, requestManifests, requestView, requestAnswer,
    requestDocuments, discardRevision, sendRevisions, setLocation
  }
)(Browser);
