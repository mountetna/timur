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

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */
export const requestView = (prj_nm,model_nm,record_nm,tab_nm,success,error)=>{
  return (dispatch)=>{

    // Handle success from 'getView'.
    var localSuccess = (response)=>{

      /*
       * Second (see 'first' below), we create a 'tab'. A 'tab' is the root
       * component on a page.
       */
      let config = response.tabs[response.tab_name];
      let tab = new Tab(model_nm, record_nm, response.tab_name, config, null);

      // Request the documents needed to populate this 'tab'.
      let ex_nm = `tab ${response.tab_name} for ${model_nm} ${record_nm}`;
      dispatch(
        requestDocuments({
          'project_name': prj_nm,
          'model_name': model_nm, 
          'record_names': [record_nm],
          'attribute_names': tab.requiredAttributes(),
          'exchange_name': ex_nm
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
        dispatch(addTab(model_nm, tab_name, response.tabs[tab_name]));
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
    var exchng = new Exchange(dispatch,`view for ${model_nm} ${record_nm}`);
    getView(prj_nm, model_nm, tab_nm, exchng)
      .then(localSuccess)
      .catch(localError);
  };
};

// Download a TSV from Magma via Timur.
export const requestTSV = (project_name, model_name, record_names)=>{
  return (dispatch)=>{

    var err = (e)=>{
      var msg = `### Our attempt to create a TSV failed.\n\n`;
      msg +=    `${error}`;
      dispatch(showMessages([msg]));
    };

    var exchng = new Exchange(dispatch, `request-tsv-${model_name}`)
    getTSV(project_name, model_name, record_names, exchng)
      .catch(err);
  };
};
