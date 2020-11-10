import React, {useState, useEffect, shallowEqual} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {pushLocation} from '../../actions/location_actions';
import {
  requestViews,
  saveNewViewAction,
  copyViewAction,
  saveViewAction
} from '../../actions/view_actions';
import DocumentWindow from '../document/document_window';
import ViewScript from './views_script';
import {getAllViews} from '../../selectors/view_selector';
import {MD5} from '../../selectors/consignment_selector';


// shallow selector
export const useShallowEqualSelector = (selector) => {
  return useSelector(selector, shallowEqual)
}


// Main component for viewing/editing views.
const ViewEditor = (props) => {
  let [editing, setEditing] = useState(useSelector(state => state.editing));
  let [view, setView] = useState(useShallowEqualSelector(state => state.view));
  let [md5sum, setMd5sum] = useState(useSelector(state => state.md5sum));
  const dispatch = useDispatch();
  let {view_id, views} = props;

  // Initial render
  useEffect(() => {
    requestViews(dispatch, () => {});
  }, []);

  // Update
  useEffect(() => {
    if (view_id && views && !view) selectView(view_id, false);
  }, [view_id, views, view]);

  const selectView = (id, push = true) => {
    let {views} = props;
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
        view = null;
        break;
      default:
        // find it in the existing views
        view = views && views.find((m) => m.id === id);
        if (!view) return;

        // copy it so you don't modify the store
        view = {...view};
        break;
    }

    setView(view);
    const md5sum = view ? MD5(view.script) : null;
    setMd5sum(md5sum);
    setEditing(id === 'new');

    if (push)

      pushLocation(
        id == null
          ? Routes.views_path(TIMUR_CONFIG.project_name)
          : Routes.view_path(TIMUR_CONFIG.project_name, id)
      )(dispatch);

  };

  const create = () => selectView('new', true);

  const activateView = (view) => selectView(view.id);

  const updateField = (field_name) => (event) => {
    let new_md5sum;
    if (field_name === 'script') {
      // the code editor does not emit an event, just the new value
      view.script = event;
      new_md5sum = MD5(view.script);
    } else {
      view[field_name] = event.target.value;
    }
    setView(view);
    setMd5sum(new_md5sum || md5sum);
  };

  const saveView = () => {
    // A new view should have an id set to 0.
    if (view.id <= 0) {
      saveNewViewAction(dispatch, view, activateView());
    } else {
      dispatch(saveViewAction(dispatch, view));
    }

    if (editing) toggleEdit();
  };

  const copyView = () => {
    dispatch(copyViewAction(view, activateView()));
  };

  const revertView = () => {

    let {id} = view;

    if (id > 0) selectView(id);
    else selectView(null);

    if (editing) toggleEdit();
  };

  const toggleEdit = () => {
    setEditing(!editing);
  };

  return (
    <DocumentWindow
      md5sum={md5sum}
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
      onCopy={copyView}
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
