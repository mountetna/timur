// Class imports.
import Vector from 'vector';
import { Exchange } from './exchange_actions';
import Tab from '../models/tab';

// Module imports.
import { getTSV, getView } from '../api/timur';
import { showMessages } from './message_actions';
import { requestDocuments } from './magma_actions';
import { requestConsignments } from './consignment_actions';

// Flip a config variable.
export const toggleConfig = (key)=>{
  return {
    'type': 'TOGGLE_CONFIG',
    key
  };
};

export const addTab = (model_name, tab_name, tab)=>{
  return {
    'type': 'ADD_TAB',
    model_name,
    tab_name,
    tab
  };
};

export const changeMode = (mode)=>{
  return {
    'type': 'CHANGE_MODE',
    mode
  };
};

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */
export const requestView = (model_name, record_name, tab_name, success, error)=>{
  return (dispatch)=>{
    // Handle success from 'getView'.
    var localSuccess = (response)=>{
      /*
       * Second (see 'first' below), we create a 'tab'. A 'tab' is the root
       * component on a page.
       */
      let config = response.tabs[response.tab_name];
      let tab = new Tab(model_name, record_name, response.tab_name, config, null);

      // Request the documents needed to populate this 'tab'.
      let exchange_name = `tab ${response.tab_name} for ${model_name} ${record_name}`;
      dispatch(
        requestDocuments({
          model_name,
          exchange_name,
          record_names: [record_name],
          attribute_names: tab.requiredAttributes(),
        })
      );

      /*
       * Request the consignments (see README.md under manifests/consignments) 
       * needed to populate this tab.
       */
      var required_manifests = tab.requiredManifests();
      if(required_manifests.length > 0){
        dispatch(requestConsignments(required_manifests));
      }

      // Add the tabs to the store.
      for(var tab_name in response.tabs){
        dispatch(addTab(model_name, tab_name, response.tabs[tab_name]));
      }

      if(success != undefined) success();
    };

    // Handle an error from 'getView'.
    var localError = (e)=>{
      if(error != undefined) error(e);
    };

    /*
     * First, we pull the view file from the Timur server. This will contain a
     * a data object that reperesents the layout of the page.
     */
    var exchange = new Exchange(dispatch,`view for ${model_name} ${record_name}`);
    getView(model_name, tab_name, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

// Download a TSV from Magma via Timur.
export const requestTSV = (model_name, record_names)=>{
  return (dispatch)=>{

    var err = (e)=>{
      var msg = `### Our attempt to create a TSV failed.\n\n`;
      msg +=    `${error}`;
      dispatch(showMessages([msg]));
    };

    var exchng = new Exchange(dispatch, `request-tsv-${model_name}`)
    getTSV(model_name, record_names, exchng)
      .catch(err);
  };
};
