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

// Main component for viewing/editing views.

const ViewEditor = (props) => {
	let [editing, setEditing] = useState(useSelector(state => state.editing));
	const dispatch = useDispatch();

	//initial render
	useEffect(() => {
		requestAllViews(() => {
		})(dispatch);
	}, []);
	let views = useSelector(state => state.views);
	let [view, setView] = useState(useShallowEqualSelector(state => state.view));

	const selectView = (viewKey, push = true) => {
		let {views} = props;
		switch (viewKey) {
			case null:
				view = null;
				break;
			default:
				// find it in the existing views
				view = views && views.find((m) => m.viewKey === viewKey);
				if (!view) return;

				// copy it so you don't modify the store
				view = {...view};
				break;
		}
		setView({...view,});
		if (push)
			pushLocation(
				viewKey == null
					? Routes.views_path(TIMUR_CONFIG.project_name)
					: Routes.curr_view_path(TIMUR_CONFIG.project_name, viewKey)
			)(dispatch);

	};

	const activateView = (view) => {
		selectView(view.model_name);
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
			//documents={views}
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
