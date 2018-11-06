// Class imports.
import {getView} from '../api/view_api';
import {Exchange} from './exchange_actions';
import * as ManifestActions from './manifest_actions';
import * as TabSelector from '../selectors/tab_selector';

const addView = (view_name, view) => ({ type: 'ADD_VIEW', view_name, view })

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */
export const requestView = (model_name, success, error) => (dispatch) => {
  let exchange = new Exchange(dispatch,`view for ${model_name}`);
  getView(model_name, exchange)
    .then(
      ({view})=>{
        dispatch(addView(model_name, view));
        if (success) success(view);
      }
    ).catch(e=> error && error(e));
};
