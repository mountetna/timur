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

// shallow selector
export const useShallowEqualSelector = (selector) => {
	return useSelector(selector, shallowEqual);
};

// views to the similar format as other documents
// TODO refactor because generates obscure keys 'list-undefined'
const addViewName = (viewsFromStore) => {
	return (
		viewsFromStore.map((view) => ({...view, name: view['model_name']}))
	);
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
	let views = addViewName(viewsFromStore);
	let [view, setView] = useState(useShallowEqualSelector(state => state.view));
	console.log(views)



	const selectView = (id, push = true) => {
		switch (id) {
			case 'new':
				let date = new Date();
				view = {
					id: 0,
					name: '',
					description: '',
					script: '',
					created_at: date.toString(),
					updated_at: date.toString()
				};
				break;
			case null:
				view = setView(null);
				break;
			default:
				// find it in the existing views
				view = setView(views && views.name);
				if (!view) return;

				// copy it so you don't modify the store
				view = setView({...view});

				break;
		}
		setView({...view});
		setEditing(id === 'new');

		if (push)
			pushLocation(
				id == null
					? Routes.views_path(CONFIG.project_name)
					: Routes.curr_view_path(CONFIG.project_name, id)
			)(dispatch);
	};

	const activateView = (view) => {
		selectView(view.id);
	};

	const create = () => selectView('new', true);

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
			documents={views}
			onCreate={create}
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
