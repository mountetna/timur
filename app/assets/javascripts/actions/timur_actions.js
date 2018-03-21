// Class imports.
import {getView} from '../api/view_api';
import {showMessages} from './message_actions';
import {requestDocuments} from './magma_actions';
import {Exchange} from './exchange_actions';
import * as ManifestActions from './manifest_actions';
import * as TabSelector from '../selectors/tab_selector';

// Flip a config variable.
export const toggleConfig = (key)=>{
  return {
    'type': 'TOGGLE_CONFIG',
    key
  };
};

export const addTab = (view_name, tab_name, tab)=>{
  return {
    type: 'ADD_TAB',
    view_name, // The view name also references a Magma Model.
    tab_name,
    tab
  };
};

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */
export const requestView = (model_nm, rec_nm, tab_nm, success, error)=>{
  return (dispatch)=>{
    // Handle success from 'getView'.
    var localSuccess = (response)=>{

      let tab;
      if(response.views[model_nm].tabs[tab_nm] == null){
        tab = response.views[model_nm].tabs['default'];
      }
      else{
        tab = response.views[model_nm].tabs[tab_nm];
      }

      // Request the documents needed to populate this 'tab'.
      let exchange_name = `tab ${tab_nm} for ${model_nm} ${rec_nm}`;
      dispatch(
        requestDocuments({
          model_name: model_nm,
          exchange_name,
          record_names: [rec_nm],
          attribute_names: TabSelector.getAttributes(tab)
        })
      );

       // Add the tab views to the store.
      for(let tab_name in response.views[model_nm].tabs){
        let action = addTab(
          model_nm, // Model name is also the view name.
          tab_name,
          response.views[model_nm].tabs[tab_name]
        );
        dispatch(action);
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
    var exchange = new Exchange(dispatch,`view for ${model_nm} ${rec_nm}`);
    getView(model_nm, tab_nm, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};
