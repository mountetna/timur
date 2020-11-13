// Class imports.
import {fetchViews, getView, createView, updateView} from '../api/view_api';
import {Exchange} from './exchange_actions';
import * as TabSelector from '../selectors/tab_selector';
import {showErrors, tryCallback} from './action_helpers';

const addViewAction = (view) => ({type: 'ADD_VIEW', view});
const loadViewsAction = (views) => ({type: 'LOAD_VIEWS', views});
const editViewAction = (view) => ({type: 'UPDATE_USER_VIEW', view});
// const removeViewAction = (id) => ({type: 'REMOVE_VIEW', id});

// Show all created views for current user
export const requestViews = (dispatch, success) => {
  let exchange = new Exchange(dispatch, 'all custom views');
  fetchViews(exchange)
    .then(({views}) => {
      dispatch(loadViewsAction(views));
      tryCallback(success, views);
    })
    .catch(showErrors(dispatch));
};

// Create a new view and save in the store.
export const saveNewViewAction = (dispatch, view, success) =>
  createView(view, new Exchange(dispatch, 'save new view'))
    .then(({view}) => {
      dispatch(addViewAction(view));
      tryCallback(success, view);
    })
    .catch(showErrors(dispatch));

// Save updated view
export const saveViewAction = (view, success) => (dispatch) =>
  updateView(view, view.id, new Exchange(dispatch, 'save edited view'))
    .then(({view}) => {
      dispatch(editViewAction(view));
    })
    .catch(showErrors(dispatch));

// Copy
export const copyViewAction = (view, success) => (dispatch) =>
  createView(
    {...view, name: `${view.name}(copy)`},
    new Exchange(dispatch, 'copy view')
  )
    .then(({view}) => {
      dispatch(addViewAction(view));
      tryCallback(success, view);
    })
    .catch(showErrors(dispatch));

/*
 * Apply a view for a given model/record/tab and send requests for additional
 * data.
 */
export const applyViewAction = (model_name, success, error) => (dispatch) => {
  let exchange = new Exchange(dispatch, `view for ${model_name}`);
  getView(model_name, exchange)
    .then(({view}) => {
      dispatch(addViewAction(model_name, view));
      if (success) success(view);
    })
    .catch((e) => error && error(e));
};

/*
// Delete a view from the database and the store.
export const deleteViewAction = (view, success) => (dispatch) =>
  destroyView(view.id, new Exchange(dispatch, 'delete-view'))
    .then(({view}) => {
      dispatch(removeViewAction(view.id));
      tryCallback(success, view);
    })
    .catch(showErrors(dispatch));

 */
