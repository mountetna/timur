// Class imports.
import {fetchAllViews, getView, updateView, createView, deleteView} from '../api/view_api';
import {Exchange} from 'etna-js/actions/exchange_actions';
import {showErrors, tryCallback} from './action_helpers';

const addView = (view_name, view) => ({type: 'ADD_VIEW', view_name, view});
const loadViews = (allViews) => ({type: 'LOAD_VIEWS', allViews});
const editView = (view) => ({type: 'UPDATE_VIEW', view});
const removeView = (id)=>({ type: 'REMOVE_VIEW', id });

/*
 * Request a view for a given model/record/tab and send requests for additional
 * data.
 */

export const requestAllViews = (success) => (dispatch) => {
  fetchAllViews(new Exchange(dispatch, 'request all views')).then(
    ({views}) => {
      dispatch(loadViews(views));
      tryCallback(success, views);
    }
  ).catch(showErrors(dispatch));
};


export const requestView = (model_name, success, error) => (dispatch) => {
  let exchange = new Exchange(dispatch, `view for ${model_name}`);
  getView(model_name, exchange)
    .then(
      ({view}) => {
        dispatch(addView(model_name, view.document));
        if (success) success(view.document);
      }
    ).catch(e => {
    let {response} = e;
    if (response && response.status == 404) dispatch(addView(model_name, {}));
    if (error) error(e);
  });
};

// Post to create new manifest and save in the store.
export const saveNewView = (view, success) => (dispatch) =>
  createView(view, new Exchange(dispatch, 'save-new-view'))
    .then(
      ({view})=>{
        dispatch(addView(view));
        tryCallback(success, view);
      }
    )
    .catch(showErrors(dispatch));

export const saveViewAction = (view, success) => (dispatch) => {
  updateView(view, view.model_name, new Exchange(dispatch, 'save view'))
    .then(
      ({view}) => {
        dispatch(editView(view));
      }
    )
    .catch(showErrors(dispatch));
};


export const deleteViewAction = (view, success) => (dispatch) => {
  deleteView(view.model_name, new Exchange(dispatch, 'delete-view'))
    .then(
      ({view}) => {
        dispatch(removeView(view.model_name));
        tryCallback(success,manifest);
      }
    )
    .catch(showErrors(dispatch));
}
