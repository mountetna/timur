// Class imports.
import {fetchAllViews, getView, updateView, createView, destroyView} from '../api/view_api';
import {Exchange} from 'etna-js/actions/exchange_actions';
import {showErrors, tryCallback} from './action_helpers';
import {createManifest} from "../api/manifests_api";

const addView = (view_name, view) => ({type: 'ADD_VIEW', view_name, view});
const loadViews = (allViews) => ({type: 'LOAD_VIEWS', allViews});
const editView = (view) => ({type: 'UPDATE_VIEW', view});
const removeView = (id)=>({ type: 'REMOVE_VIEW', id });

/*
 * Request a view for a given model/record/tab and send requests for additional
 * data.
 */

export const requestAllViews = (success) => (dispatch) =>
  fetchAllViews(new Exchange(dispatch, 'request all views')).then(
    ({views}) => {
      dispatch(loadViews(views));
      tryCallback(success, views);
    }
  ).catch(showErrors(dispatch));


export const requestView = (model_name, success, error) => (dispatch) =>
  getView(model_name, new Exchange(dispatch, `view for ${model_name}`))
    .then(
      ({view}) => {
        dispatch(addView(model_name, view.document));
        if (success) success(view.document);
      }
    ).catch(
      e => {
        let {response} = e;
        if (response && response.status == 404) dispatch(addView(model_name, {}));
        if (error) error(e);
      }
    );

export const saveView = (view, success) => (dispatch) =>
  updateView(view, view.model_name, new Exchange(dispatch, 'save-view'))
    .then(({view}) => dispatch(editView(view)))
    .catch(showErrors(dispatch));

export const saveNewView = (view, success) => (dispatch) =>
  createView(view, new Exchange(dispatch, 'save-new-view'))
    .then(
      (view) => {
        dispatch(addView(view));
        tryCallback(success, view);
      }
    )
    .catch(showErrors(dispatch));

export const deleteView = (view, success) => (dispatch) =>
  destroyView(view, new Exchange(dispatch, 'delete-view'))
    .then(
      () => {
        dispatch(removeView(view.id));
        tryCallback(success,manifest);
      }
    )
    .catch(showErrors(dispatch));
