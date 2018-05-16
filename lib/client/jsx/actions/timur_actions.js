// Class imports.
import * as ViewAPI from '../api/view_api';
import {showMessages} from './message_actions';
import {Exchange} from './exchange_actions';
import * as MagmaActions from './magma_actions';
import * as ViewAPI from '../api/view_api';
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

export const addTokenUser = (user)=>{
  return {
    type: 'ADD_TOKEN_USER',
    token: Cookies.getItem(TIMUR_CONFIG.token_name)
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

export const addView = (view_name, view)=>{
  return {
    type: 'ADD_VIEW',
    view_name, // The view name also references a Magma Model.
    view
  };
};

export const refreshViews = (views)=>{
  return {
    type: 'REFRESH_VIEWS',
    views
  };
};

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */
export const requestView = (args, project_name)=>{

  // Unpack the arguments.
  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;
  let {model_name, record_name, tab_name, success, error} = args;

  return (dispatch)=>{
    // Handle success from 'getView'.
    let localSuccess = (response)=>{

      let tab;
      if(response.views[model_name].tabs[tab_name] == null){
        tab = response.views[model_name].tabs['default'];
      }
      else{
        tab = response.views[model_name].tabs[tab_name];
      }

      // Request the documents needed to populate this 'tab'.
      let exchange_name = `tab ${tab_name} for ${model_name} ${record_name}`;
      dispatch(
        MagmaActions.requestDocuments({
          model_name: model_name,
          exchange_name,
          record_names: [record_name],
          attribute_names: TabSelector.getAttributes(tab)
        })
      );

      // Add the tab views to the store.
      for(let tab_nm in response.views[model_name].tabs){
        let action = addTab(
          `${project_name}_${model_name}`, // Model name is also the view name.
          tab_nm,
          response.views[model_name].tabs[tab_nm]
        );
        dispatch(action);
      }

      if(success != undefined) success();
    };

    // Handle an error from 'getView'.
    let localError = (e)=>{
      if(error != undefined) error(e);
    };

    /*
     * First, we pull the view file from the Timur server. This will contain a
     * a data object that reperesents the layout of the page.
     */
    let exchange = new Exchange(dispatch,`view ${model_name} ${record_name}`);
    ViewAPI.getView(model_name, tab_name, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

export const requestViewSettings = ()=>{
  return (dispatch)=>{
    let localSuccess = (response)=>{
      Object.keys(response.views).forEach((key)=>{
        dispatch(addView(key, response.views[key]));
      });
    };

    let localError = (err)=>{
      console.log(err);
    };

    let exchange = new Exchange(dispatch,'view for settings');
    ViewAPI.getView('all', 'all', exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

export const updateViewSettings = (view_obj)=>{
  return (dispatch)=>{
    let localSuccess = (response)=>{
      dispatch(refreshViews(response.views));
    };

    let localError = (err)=>{
      console.log(err);
    };

    let exchange = new Exchange(dispatch,'updating view settings');
    ViewAPI.updateView(view_obj, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};

export const deleteViewSettings = (view_obj)=>{
  return (dispatch)=>{
    let localSuccess = (response)=>{
      dispatch(refreshViews(response.views));
    };

    let localError = (err)=>{
      console.log(err);
    };

    let exchange = new Exchange(dispatch,'delete view settings');
    ViewAPI.deleteView(view_obj, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};
