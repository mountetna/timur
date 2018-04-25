// Module imports.
import * as ViewAPI from '../api/view_api';
import * as MagmaActions from './magma_actions';
import * as ManifestActions from './manifest_actions';
import * as TabSelector from '../selectors/tab_selector';
import * as Cookies from '../utils/cookies';

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

// See the loader_ui component for infomation on these two actions.
export const popLoaderUI = ()=>{
  return {
    type: 'POP_LOADER_STACK'
  };
};

export const pushLoaderUI = ()=>{
  return {
    type: 'PUSH_LOADER_STACK'
  };
};

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */
export const requestView = (model_nm, rec_nm, tab_nm, success, error)=>{
  return (dispatch)=>{
    dispatch(pushLoaderUI());

    // Handle success from 'getView'.
    var localSuccess = (response)=>{
      dispatch(popLoaderUI());

      let tab;
      if(response.views[model_nm].tabs[tab_nm] == null){
        tab = response.views[model_nm].tabs['default'];
      }
      else{
        tab = response.views[model_nm].tabs[tab_nm];
      }

      // Request the documents needed to populate this 'tab'.
      dispatch(
        MagmaActions.requestDocuments({
          model_name: model_nm,
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
      dispatch(popLoaderUI());
      if(error != undefined) error(e);
    };

    /*
     * First, we pull the view file from the Timur server. This will contain a
     * a data object that reperesents the layout of the page.
     */
    ViewAPI.getView(model_nm, tab_nm)
      .then(localSuccess)
      .catch(localError);
  };
};

export const addTokenUser = (user)=>{
  return {
    type: 'ADD_TOKEN_USER',
    token: Cookies.getItem('JANUS_TOKEN')
  };
};


