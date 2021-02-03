// Class imports.
import {fetchAllViews, getView, updateView} from '../api/view_api';
import {Exchange} from './exchange_actions';
import {showErrors, tryCallback} from './action_helpers';


const addView = (view_name, view) => ({type: 'ADD_VIEW', view_name, view});
const loadViews = (allViews) => ({type: 'LOAD_VIEWS', allViews});
const editView = (view) => ({type: 'UPDATE_VIEW', view});

/*
 * Request a view for a given model/record/tab and send requests for additional 
 * data.
 */

export const requestAllViews = (success) => (dispatch) => {
	fetchAllViews(new Exchange(dispatch, 'request all views')).then(
		(allViews) => {
			dispatch(loadViews(allViews));
			tryCallback(success, allViews);
		}
	).catch(showErrors(dispatch));
};


export const requestView = (model_name, success, error) => (dispatch) => {
	let exchange = new Exchange(dispatch, `view for ${model_name}`);
	getView(model_name, exchange)
		.then(
			({document}) => {
				dispatch(addView(model_name, document));
				if (success) success(document);
			}
		).catch(e => {
		let {response} = e;
		if (response && response.status == 404) dispatch(addView(model_name, {}));
		if (error) error(e);
	});
};


export const saveViewAction = (view, success) => (dispatch) => {
	updateView(view, view.model_name, new Exchange(dispatch, 'save view'))
		.then(
			(view) => {
				dispatch(editView(view));
			}
		)
		.catch(showErrors(dispatch));
};
