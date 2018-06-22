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
import * as ReactRedux from 'react-redux';

// Class imports.
import Magma from '../../magma';
import Header from '../header';
import {HelpContainer as Help} from '../help';
import {TabBarContainer as TabBar} from '../tab_bar';
import BrowserTab from './browser_tab';

// Module imports.
import * as ManifestActions from '../../actions/manifest_actions';
import * as PlotActions from '../../actions/plot_actions';
import * as TimurActions from '../../actions/timur_actions';
import * as MagmaActions from '../../actions/magma_actions';
import * as TabSelector from '../../selectors/tab_selector';

export class Browser extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      mode: 'loading',
      current_tab_index: 0,
      current_tab_name: 'overview'
    };
  }

  componentDidMount(){
    let {model_name, record_name} = this.props;
    let onSuccess = ()=>{this.setState({mode: 'browse'})};

    this.props.requestManifests();
    this.props.requestPlots();
    this.props.requestView(model_name, record_name, 'overview', onSuccess.bind(this));
  }

  camelize(str){
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index){
      return letter.toUpperCase();
    }).replace(/\s+/g, '');
  }

  headerHandler(action){
    switch(action){
      case 'cancel':

        this.setState({mode: 'browse'});
        this.props.discardRevision(
          this.props.record_name,
          this.props.model_name
        );
        return;
      case 'approve':

        if(this.props.has_revisions){

          this.setState({mode: 'submit'});
          this.props.sendRevisions(
            this.props.model_name,
            {[this.props.record_name] : this.props.revision},
            ()=>this.setState({mode: 'browse'}),
            ()=>this.setState({mode: 'edit'})
          );
        }
        else{

          this.setState({mode: 'browse'});
          this.props.discardRevision(
            this.props.record_name,
            this.props.model_name
          );
        }
        return;
      case 'edit':

        this.setState({mode: 'edit'});
        return;
    }
  }

  tabSelectionHandler(index_order){

    let {requestDocuments, model_name, record_name, view, doc} = this.props;

    // Set the new requested tab state.
    this.setState({current_tab_index: index_order});

    // If the current tab data isn't in the store then request the tab data.
    tab_check_loop:
    for(let tab_name in view.tabs){

      // Check for the matching tab's index.
      if(view.tabs[tab_name].index_order == index_order){

        /*
         * If the attributes from the tab are already present in the model's
         * document then we break.
         */
        let tab_attr = TabSelector.getAttributes(view.tabs[tab_name]);
        for(let attr_name in doc){
          if(tab_attr.includes(attr_name)) break tab_check_loop;
        }

        /*
         * If the attributes required from the tab are NOT present in the
         * model's document then we need to request that data.
         */
        requestDocuments(model_name, record_name, tab_attr);
        break tab_check_loop;
      }
    }
  }

  renderEmpytView(){
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
    let {can_edit, revision, view, template, doc} = this.props;

    // Render an empty view if there is no view data yet.
    if(!view || !template || !doc) return this.renderEmpytView();

    let header_props = {
      mode,
      can_edit,
      handler: this.headerHandler.bind(this)
    };

    let tab_bar_props = {
      mode,
      revision,
      view,
      current_tab_index,
      clickTab: this.tabSelectionHandler.bind(this)
    };

    // Select the current tab data from by the 'current_tab_index'.
    let tab = TabSelector.getTabByIndexOrder(view.tabs, current_tab_index);

    /*
     * Add the attribute details from the Magma model into the Timur view model.
     * and append the actual data to it.
     */
    tab = TabSelector.interleaveAttributes(tab, template);

    var browser_tab_props = {
      template,
      doc,
      revision,
      mode,
      tab
    };

    // Set at 'skin' on the browser styling.
    let skin = 'browser';
    if(this.state.mode == 'browse') skin = 'browser '+this.props.model_name;

    return(
      <div className={skin}>

        <Header {...header_props}>

          <div className='model-name'>

            {this.camelize(this.props.model_name)}
          </div>
          <div className='record-name'>

            {this.props.record_name}
          </div>
          <Help info='edit' />
        </Header>
        <TabBar {...tab_bar_props} />
        <BrowserTab {...browser_tab_props} />
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{

  let {model_name, record_name} = own_props;

  let magma = new Magma(state);
  let template = magma.template(model_name);
  let doc = magma.document(model_name, record_name);
  let revision = magma.revision(model_name, record_name) || {};
  let view = (state.timur.views ? state.timur.views[model_name] : null);

  return {
    template,
    revision,
    view,
    doc,
    has_revisions: (Object.keys(revision).length > 0)
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestPlots: ()=>{
      dispatch(PlotActions.requestPlots());
    },

    requestManifests: ()=>{
      dispatch(ManifestActions.requestManifests());
    },

    requestView: (model_name, record_name, tab_name, onSuccess)=>{
      dispatch(TimurActions.requestView(
        model_name,
        record_name,
        tab_name,
        onSuccess
      ));
    },

    requestDocuments: (model_name, record_name, attribute_names)=>{
      let exchange_name = `${model_name} ${record_name}`;
      dispatch(MagmaActions.requestDocuments({
        model_name,
        exchange_name,
        record_names: [record_name],
        attribute_names
      }));
    },

    discardRevision: ()=>{
      dispatch(MagmaActions.discardRevision());
    },

    sendRevisions: (model_name, revisions, success, error)=>{
      dispatch(MagmaActions.sendRevisions(model_name,revisions,success,error));
    }
  };
};

export const BrowserContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Browser);
