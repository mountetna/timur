// Class imports.
import {Exchange} from './exchange_actions';

// Module imports.
import {getItem} from '../utils/cookies';
import {getAttributes} from '../selectors/tab_selector';
import {requestDocuments} from '../actions/magma_actions';
import {
  getView,
  updateView,
  deleteView
} from '../api/view_api';

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
    token: getItem(TIMUR_CONFIG.token_name)
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

const addTab = (view_name, tab_name, tab)=>{
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
export const requestView = (args, project_name)=>{

  // Unpack the arguments.
  if(project_name == undefined) project_name = TIMUR_CONFIG.project_name;
  let {model_name, record_name, tab_name, success, error} = args;

  /*
   * 'model_name' and 'mdl_nm' are different. The models from Magma
   * namespaced with the project. The view data from Timur (which has a
   * correspondence with the Magma models) is not namespaced.
   */
  let mdl_nm = model_name.split('_');
  let prjt_nm = mdl_nm.shift();
  mdl_nm = mdl_nm.join('_');
  if(mdl_nm == '') mdl_nm = model_name;

  return (dispatch)=>{
    // Handle success from 'getView'.
    let localSuccess = (response)=>{

      let tab;
      if(response.views[mdl_nm].tabs[tab_name] == null){
        tab = response.views[mdl_nm].tabs['default'];
      }
      else{
        tab = response.views[mdl_nm].tabs[tab_name];
      }

      // Request the documents needed to populate this 'tab'.
      let exchange_name = `tab ${tab_name} for ${model_name} ${record_name}`;
      dispatch(
        requestDocuments({
          model_name,
          exchange_name,
          record_names: [record_name],
          attribute_names: getAttributes(tab)
        })
      );

      // Use the namespaced model name to add the view to the store.
      for(let tab_nm in response.views[mdl_nm].tabs){
        let action = addTab(
          model_name,
          tab_nm,
          response.views[mdl_nm].tabs[tab_nm]
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
    let exchg = new Exchange(dispatch,`view for ${model_name} ${record_name}`);
    getView(mdl_nm, tab_name, exchg)
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
    getView('all', 'all', exchange)
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
    updateView(view_obj, exchange)
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
    deleteView(view_obj, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};
