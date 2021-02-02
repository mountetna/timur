import React, {useState, useEffect, shallowEqual} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux';
import {pushLocation, setLocation} from '../../actions/location_actions';
import {
	requestView,
	requestAllViews,
	saveNewViewAction,
	copyViewAction,
	saveViewAction
} from '../../actions/view_actions';
import DocumentWindow from '../document/document_window';
import ViewScript from './views_script';
import {MD5} from '../../selectors/consignment_selector';

// shallow selector
export const useShallowEqualSelector = (selector) => {
	return useSelector(selector, shallowEqual);
};

// views to the similar format as other documents
// TODO refactor because generates obscure keys 'list-undefined'
const unpackViews = (viewsFromStore) => {
	return viewsFromStore.reduce((allViews, view) => {
		for (let tab of view.document.tabs) {
			tab['model_name'] = view.model_name;
			let newName = [view.model_name, tab.name].join('_');
			tab['id'] = newName;
			allViews[newName] = tab;
		}
		return allViews;
	}, {});
};

// Main component for viewing/editing views.

const ViewEditor = (props) => {
	let [editing, setEditing] = useState(useSelector(state => state.editing));
	const dispatch = useDispatch();

	//initial render
	useEffect(() => {
		requestAllViews(() => {
		})(dispatch);
	}, []);
	let viewsFromStore = useSelector(state => Object.values(state.views));
	let views = unpackViews(viewsFromStore);
	let [view, setView] = useState(useShallowEqualSelector(state => state.view));
	console.log(views)


	const selectView = (id, push = true) => {
		switch (id) {
			case null:
				view = setView(null);
				break;
			default:
				// find it in the existing views
				view = setView(views && views.id);
				if (!view) return;

				// copy it so you don't modify the store
				view = setView({...view});

				break;
		}
		setView({...view});

		if (push)
			pushLocation(
				id == null
					? Routes.fetch_view_path(TIMUR_CONFIG.project_name)
					: Routes.view_path(TIMUR_CONFIG.project_name, id)
			)(dispatch);

	};

	const activateView = (view) => {
		selectView(view.id);
	};

	const updateField = (field_name) => (event) => {
		if (field_name === 'script') {
			// the code editor does not emit an event, just the new value
			view.script = event;
		} else {
			view[field_name] = event.target.value;
		}
		setView({...view,});
	};

	const saveView = () => {
		// A new view should have an id set to 0.
		saveViewAction(dispatch, activateView(view));
		if (editing) toggleEdit();
	};


	const revertView = () => {
		let {model_name} = view.model_name;
		selectView(model_name);
		if (editing) toggleEdit();
	};

	const toggleEdit = () => {
		setEditing(!editing);
	};

	return (
		<DocumentWindow
			documentType='view'
			editing={editing}
			document={view}
			documents={Object.values(views)}
			//onCreate={create}
			onSelect={activateView}
			onUpdate={updateField}
			onEdit={toggleEdit}
			onCancel={revertView}
			onSave={saveView}
			//onCopy={copyView}
		>
			<ViewScript
				script={view && view.script}
				is_editing={editing}
				onChange={updateField('script')}
			/>
		</DocumentWindow>
	);
};
export default ViewEditor;
