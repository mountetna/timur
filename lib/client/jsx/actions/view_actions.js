// Class imports.
import {fetchViews, getView} from '../api/view_api';
import {Exchange} from './exchange_actions';
import * as ManifestActions from './manifest_actions';
import * as TabSelector from '../selectors/tab_selector';
import {fetchManifests} from "../api/manifests_api";
import {showErrors, tryCallback} from "./action_helpers";

const addView = (view_name, view) => ({ type: 'ADD_VIEW', view_name, view })
const loadViews = (views)=>({ type: 'LOAD_VIEW', views });


// Show all created views for current user
export const requestViews = (success) => (dispatch) => {
    let exchange = new Exchange(dispatch,`custom views`);
    fetchViews(exchange)
        .then(
            ({views})=>{
                dispatch(loadViews(views));
                tryCallback(success, views);
            }
        ).catch(showErrors(dispatch));
};


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