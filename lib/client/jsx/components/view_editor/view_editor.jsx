import React, {useState, useEffect, shallowEqual} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux';
import {pushLocation, setLocation} from '../../actions/location_actions';
import {
  requestView,
  saveNewViewAction,
  copyViewAction,
  saveViewAction
} from '../../actions/view_actions';
import DocumentWindow from '../document/document_window';
import ViewScript from './views_script';
import {getAllViews} from '../../selectors/view_selector';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {MD5} from '../../selectors/consignment_selector';
import {requestAnswer, requestModel} from '../../actions/magma_actions';


// shallow selector
export const useShallowEqualSelector = (selector) => {
  return useSelector(selector, shallowEqual);
};

// Main component for viewing/editing views.

const ViewEditor = (props) => {
  let [editing, setEditing] = useState(useSelector(state => state.editing));
  let defaultView = requestView('project')



  let [view, setView] = useState(useShallowEqualSelector(state => state.view));
  const dispatch = useDispatch();
  let [views, setViews] = useState(useShallowEqualSelector(state => state));

  const thisStore = useStore()
  //const views = getAllViews(thisStore.getState())
  console.log(thisStore.getState())
  let view_id = props.view_id;

  // Initial render
  useEffect(() => {
    requestView(dispatch, () => {});
  }, [views]);

/*  useEffect(() => {
    // Decide data that should be loaded immediately.
    if (!model_name && !record_name) {
      // ask magma for the project name
      invoke(
          requestAnswer(
              {query: ['project', '::first', '::identifier']},

              // redirect there
              ({answer}) =>
                  invoke(
                      setLocation(
                          Routes.browse_model_path(CONFIG.project_name, 'project', answer)
                      )
                  )
          )
      );
    } else {
      if (!template) requestModel(model_name);
      if (!view) {
        // we are told the model and record name, get the view
        invoke(requestView(model_name, selectOrShowTab));
      } else if (!tab_name) {
        selectDefaultTab(view);
      } else {
        showTab(view);
      }
    }
  }, [template, view]);*/



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
            md5sum: '',
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

      const md5sum = view ? MD5(view.script) : null;
      setView({...view, });
      setEditing(id === 'new');

      if (push)

        pushLocation(
          id == null
            ? Routes.views_path(TIMUR_CONFIG.project_name)
            : Routes.curr_view_path(TIMUR_CONFIG.project_name, id)
        )(dispatch);

    };

    const create = () => selectView('new', true);

    const activateView = (view) => {
      selectView(view.id);
    };

    const updateField = (field_name) => (event) => {
      let new_md5sum;
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
      if (view.id <= 0) {
        saveNewViewAction(dispatch, view);
      } else {
        saveViewAction(dispatch, activateView(view));
      }

      if (editing) toggleEdit();
    };

    const copyView = () => {
      dispatch(copyViewAction(view, activateView(view)));
    };

    const revertView = () => {

      let {id} = view.id;

      if (id > 0) selectView(id);
      else selectView(null);

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
