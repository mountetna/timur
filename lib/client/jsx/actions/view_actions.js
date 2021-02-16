// Class imports.
import {getView} from '../api/view_api';
import {Exchange} from 'etna-js/actions/exchange_actions';
import * as ManifestActions from './manifest_actions';
import { defaultView } from '../selectors/tab_selector';

const addView = (view_name, view) => ({ type: 'ADD_VIEW', view_name, view })

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */
export const requestView = (model_name) => (dispatch) => {
  let exchange = new Exchange(dispatch,`view for ${model_name}`);
  return getView(model_name, exchange)
    .then(
      ({document})=>{
        dispatch(addView(model_name, document));
        return document;
      }
    ).catch(e => {
      // e should be either response.json() or response.text()
      return e.then((body) => {
        if (body && body.error && body.error.match(/^No.+view/i)) {
          // Default view
          dispatch(addView(model_name, {}));
          return {};
        } else throw new Error('Failed to load view: ' + body);
      });
    });
};
