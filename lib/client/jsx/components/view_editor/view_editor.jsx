import React, {useState, useEffect, shallowEqual} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux';
import {pushLocation, setLocation} from 'etna-js/actions/location_actions';
import {
	requestView,
	requestAllViews,
	deleteViewAction,
	saveViewAction
} from '../../actions/view_actions';
import DocumentWindow from '../document/document_window';
import ViewScript from './views_script';

// shallow selector
export const useShallowEqualSelector = (selector) => {
	return useSelector(selector, shallowEqual);
};


// Main component for viewing/editing views.

const ViewEditor = (props) => {
	let [editing, setEditing] = useState(useSelector(state => state.editing));
	const dispatch = useDispatch();
	let [view, setView] = useState(useShallowEqualSelector(state => state.view));
	let views = useSelector(state => state.views);

	//initial render
	useEffect(() => {
		requestAllViews(() => {
		})(dispatch);
	}, []);


	const selectView = (id, push = true) => {
		switch (id) {
			case 'new':
				let date = new Date();
				view = {
					id: 'new',
					name: '',
					description: '',
					document: '',
					created_at: date.toString(),
					updated_at: date.toString()
				};
				setView({...view});
				break;
			case null:
				view = setView(null);
				break;
			default:
				// find it in the existing views
				let curr_view = views[id];
				if (!curr_view) return;
				// copy it so you don't modify the store
				setView({...curr_view});
				break;
		}
		setEditing(id === 'new');
		if (push)
			pushLocation(
				id == null
					? Routes.views_path(CONFIG.project_name)
					: Routes.curr_view_path(CONFIG.project_name, id)
			)(dispatch);
	};

	const activateView = (id) => {
		selectView(id);
	};

	const create = () => selectView('new', true);

	const updateField = (field_name) => (event) => {
		if (field_name === 'document') {
			// the code editor does not emit an event, just the new value
			view.document = event;
		} else {
			view[field_name] = event.target.value;
		}
		setView({...view,});
	};

	const saveView = () => {
		// A new view should have an id set to 0.
		saveViewAction(view)(dispatch);
		if (editing) toggleEdit();
	};

	const revertView = () => {
		let {model_name} = view.model_name;
		selectView(model_name);
		if (editing) toggleEdit();
	};

	const deleteView = () => {
		if(confirm('Are you sure you want to remove this manifest?')){
			deleteViewAction(view, () => selectView(0))(dispatch);
		}
	}
	const toggleEdit = () => {
		setEditing(!editing);
	};

	return (
		<DocumentWindow
			documentType='view'
			editing={editing}
			document={view}
			documents={views}
			onCreate={create}
			onSelect={activateView}
			onUpdate={updateField}
			onEdit={toggleEdit}
			onCancel={revertView}
			onSave={saveView}
			onRemove={deleteView}
		>
			<ViewScript
				script={view && view.document}
				is_editing={editing}
				onChange={updateField('document')}
			/>
		</DocumentWindow>
	);
};
export default ViewEditor;
