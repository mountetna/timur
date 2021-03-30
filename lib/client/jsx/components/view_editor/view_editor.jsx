import React, {useState, useCallback, useEffect, shallowEqual} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux';
import {pushLocation, setLocation} from 'etna-js/actions/location_actions';
import {
  requestView,
  requestAllViews,
  deleteView,
  saveNewView,
  saveView
} from '../../actions/view_actions';
import DocumentWindow from '../document/document_window';
import ViewScript from './views_script';

// shallow selector
export const useShallowEqualSelector = (selector) => {
  return useSelector(selector, shallowEqual);
};


// Main component for viewing/editing views.

const ViewEditor = ({view_id}) => {
  let [editing, setEditing] = useState(useSelector(state => state.editing));
  const dispatch = useDispatch();
  let [view, setActualView] = useState(null);
  const [canSave, setCanSave] = useState(true);
  let views = useSelector(state => state.views);

  let setView = useCallback(
    (view) => view ? setActualView(
      {
        ...view,
        document: typeof(view.document) === 'string' ? view.document : JSON.stringify(view.document, null, '\t')
      }
    ) : setActualView(view), [setActualView]
  );

  //initial render
  useEffect(
    () => { requestAllViews()(dispatch) }, []
  );

  useEffect(
    () => {
      if (view_id && views && !view) selectView(view_id, false);
    }, [ views ]
  );

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
        setView(view);
        break;
      case null:
        view = setView(null);
        break;
      default:
        // find it in the existing views
        let curr_view = views[id];
        if (!curr_view) return;
        // copy it so you don't modify the store
        setView(curr_view);
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

  const hasLintingErrors = (value) => {
    window.JSHINT(value);

    return (
      JSHINT.data().errors &&
      JSHINT.data().errors.length > 0
    );
  }

  const updateField = (field_name) => (event) => {
    if (field_name === 'document') {
      // the code editor does not emit an event, just the new value
      view.document = event;
      
      setCanSave(!hasLintingErrors(event));
    } else {
      view[field_name] = event.target.value;
    }
    setView({...view,});
  };

  const onSave = () => {
    // A new view should have an id set to 0.
    let savedView = { ...view, document: JSON.parse(view.document) };
    if (view_id == 'new')
      saveNewView(savedView)(dispatch);
    else
      saveView(savedView)(dispatch);
    if (editing) toggleEdit();
  };

  const revertView = () => {
    let {model_name} = view.model_name;
    selectView(model_name);
    if (editing) toggleEdit();
  };

  const onDelete = () => {
    if(confirm('Are you sure you want to remove this view?')){
      deleteView(view, () => selectView(null))(dispatch);
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
      documents={Object.values(views)}
      onCreate={create}
      onSelect={activateView}
      onUpdate={updateField}
      onEdit={toggleEdit}
      onCancel={revertView}
      onSave={onSave}
      onRemove={onDelete}
      documentName='model_name'
      canSave={canSave}
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
