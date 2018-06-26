// Class imports.
import {Exchange} from './exchange_actions';

// Module imports.
import {showMessages} from './message_actions';
import {requestDocuments} from './magma_actions';
import {getAttributes} from '../selectors/tab_selector';
import {getItem} from '../utils/cookies';
import {
  getView,
  updateView,
  deleteView
} from '../api/view_api';

const addTab = (view_name, tab_name, tab)=>{
  return {
    type: 'ADD_TAB',
    view_name, // The view name also references a Magma Model.
    tab_name,
    tab
  };
};

const addView = (view_name, view)=>{
  return {
    type: 'ADD_VIEW',
    view_name, // The view name also references a Magma Model.
    view
  };
};

const refreshViews = (views)=>{
  return {
    type: 'REFRESH_VIEWS',
    views
  };
};

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

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */
export const requestView = (model_nm, rec_nm, tab_nm, success, error)=>{
  return (dispatch)=>{
    // Handle success from 'getView'.
    let localSuccess = (response)=>{

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
          attribute_names: getAttributes(tab)
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
    let localError = (e)=>{
      if(error != undefined) error(e);
    };

    /*
     * First, we pull the view file from the Timur server. This will contain a
     * a data object that reperesents the layout of the page.
     */
    let exchange = new Exchange(dispatch,`view for ${model_nm} ${rec_nm}`);
    return getView(model_nm, exchange)
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

    let exchange = new Exchange(dispatch, 'view for settings');
    return getView('all', exchange)
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

    let exchange = new Exchange(dispatch, 'updating view settings');
    return updateView(view_obj, exchange)
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

    let exchange = new Exchange(dispatch, 'delete view settings');
    return deleteView(view_obj, exchange)
      .then(localSuccess)
      .catch(localError);
  };
};
