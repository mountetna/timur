// Class imports.
import {fetchViews, getView, createView, updateView, destroyView} from '../api/view_api';
import {Exchange} from './exchange_actions';
import * as TabSelector from '../selectors/tab_selector';
import {showErrors, tryCallback} from './action_helpers';
import views from '../reducers/view_reducer';

const addView = (view_name, view) => ({ type: 'ADD_VIEW', view_name, view });
const loadViews = (views)=>({ type: 'LOAD_VIEW', views });
const editView = (view)=>({type: 'UPDATE_USER_VIEW', view});
const removeView = (id)=>({ type: 'REMOVE_VIEW', id });


// Show all created views for current user
export const requestViews = (success) => (dispatch) => {
    let exchange = new Exchange(dispatch,'custom views');
    fetchViews(exchange)
        .then(
            ({views})=>{
                dispatch(loadViews(views));
                tryCallback(success, views);
            }
        ).catch(showErrors(dispatch));
};

// Create a new view and save in the store.
export const saveNewView = (view, success) => (dispatch) =>
    createView(view, new Exchange(dispatch, 'save new view'))
        .then(
            ({view})=>{
                dispatch(addView(view));
                tryCallback(success, view);
            }
        )
        .catch(showErrors(dispatch));

// Save updated view
export const saveView = (view, success) => (dispatch)=>
    updateView(view, view.id, new Exchange(dispatch, 'save edited view'))
        .then(
            ({view})=>{
                dispatch(editView(view));
            }
        )
        .catch(showErrors(dispatch));

// Copy
export const copyView = (view, success) => (dispatch) =>
    createView(
        {...view, 'name': `${view.name}(copy)`},
        new Exchange(dispatch, 'copy view')
    ).then(
        ({view})=>{
            dispatch(addView(view));
            tryCallback(success, view);
        }
    ).catch(showErrors(dispatch));

/*
 * Apply a view for a given model/record/tab and send requests for additional
 * data.
 */
export const applyView = (model_name, success, error) => (dispatch) => {
    let exchange = new Exchange(dispatch,`view for ${model_name}`);
    getView(model_name, exchange)
        .then(
            ({view})=>{
                dispatch(addView(model_name, view));
                if (success) success(view);
            }
        ).catch(e=> error && error(e));
};

// Delete a view from the database and the store.
export const deleteView = (view, success) => (dispatch) =>
    destroyView(view.id, new Exchange(dispatch, 'delete-view'))
        .then(
            ({view})=>{
                dispatch(removeView(view.id));
                tryCallback(success,view);
            }
        )
        .catch(showErrors(dispatch));

