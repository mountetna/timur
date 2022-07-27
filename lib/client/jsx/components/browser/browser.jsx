/*
 * The Browser presents views of a record/model. The views are organized into
 * tabs/panes.
 *
 * The Browser should request data for a record/model/tab - this comes with an
 * associated payload and any extra data required to draw this tab.
 *
 * The Browser has state in the form of mode (edit or not) and tab (which one is
 * shown).
 */

// Framework libraries.
import React, {useState, useCallback, useEffect, useMemo} from 'react';
import 'regenerator-runtime/runtime';
import useAsyncWork from "etna-js/hooks/useAsyncWork";

// Class imports.
import Header from '../header';
import ViewTabBar from './view_tab_bar';
import ViewTab from './view_tab';

// Module imports.
import {setLocation} from 'etna-js/actions/location_actions';
import {requestView} from '../../actions/view_actions';
import {
  sendRevisions,
  discardRevision,
  requestModel,
  requestAnswer
} from 'etna-js/actions/magma_actions';
import {
  getAttributes,
  getDefaultTab,
  selectView
} from '../../selectors/tab_selector';
import {
  selectTemplate,
  selectDocument,
  selectRevision
} from 'etna-js/selectors/magma';
import {selectIsEditor} from 'etna-js/selectors/user-selector';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {useRequestDocuments} from '../../hooks/useRequestDocuments';

const loadingDiv = (
  <div className='browser'>
    <div id='loader-container'>
      <div className='loader'>Loading...</div>
    </div>
  </div>
);

const errorDiv = (
  <div className='browser'>
    <div id='loader-container'>
      <div className='loader'>Failed to load.</div>
    </div>
  </div>
);

const notFoundDiv = (
  <div className='browser'>
    <div id='loader-container'>
      <div className='loader'>Record not found</div>
    </div>
  </div>
);

function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

export default function Browser({ model_name, record_name, tab_name }) {
  const invoke = useActionInvoker();
  const browserState = useReduxState(
    browserStateOf({ model_name, record_name, tab_name })
  );
  let { view, record, tab, revision, template, can_edit } = browserState;
  const [mode, setMode] = useState('loading');
  const [error, setError] = useState(null);
  const { cancelEdits, approveEdits } = useEditActions(setMode, browserState);
  const requestDocuments = useRequestDocuments();

  const browseToTab = useCallback((tabName) => {
    invoke(setLocation(window.location.href.replace(/#.*/, '') + `#${tabName}`));
  }, [invoke, setLocation]);

  // Set at 'skin' on the browser styling.
  let skin = 'browser';
  if (mode === 'browse') skin = 'browser ' + model_name;
  const editMode = useCallback(() => setMode('edit'), [setMode]);

  const [_, loadDocuments, awaitNextState] = useAsyncWork(function* loadDocuments() {
    setMode('loading');

    if (!model_name && !record_name) {
      // ask magma for the project name
      const { answer } = yield invoke(requestAnswer({ query: ['project', '::first', '::identifier'] }));
      invoke(setLocation(
        Routes.browse_model_path(CONFIG.project_name, 'project', answer)
      ))
      return;
    }

    if (!template) {
      yield invoke(requestModel(model_name));
      ({ template } = yield awaitNextState());
    }

    if (!view) {
      // we are told the model and record name, get the view
      yield invoke(requestView(model_name));
      ({ view } = yield awaitNextState());
    }

    if (!tab_name) {
      browseToTab(getDefaultTab(view));
      return;
    }

    const tab = view.tabs.find(t => t.name == tab_name)
    if (!tab) throw new Error('Could not find tab by the name ' + tab_name);

    let exchange_name = `tab ${tab.name} for ${model_name} ${record_name}`;
    let attribute_names = getAttributes(tab);

    let hasAttributes =
      record &&
      template &&
      attribute_names.every(attr_name => attr_name in record);

    // ensure attribute data is present in the document
    if (!hasAttributes) {
      // or else make a new request
      yield requestDocuments({
        model_name,
        record_names: [record_name],
        attribute_names,
        exchange_name,
      });
    }

    setMode('browse');
  }, { cancelWhenChange: [], renderedState: { view, template } });

  // On mount, startup the loading process.
  useEffect(() => {
    loadDocuments().catch(e => {
      console.error(e);
      setError(e);
    });
  }, [])

  if (error) {
    return errorDiv;
  }

  if (mode === 'loading') {
    return loadingDiv;
  }

  if (!record) {
    return notFoundDiv;
  }

  return (
    <div className={skin}>
      <Header
        onEdit={mode === 'browse' && can_edit && editMode}
        onSave={mode === 'edit' && approveEdits}
        onCancel={mode === 'edit' && cancelEdits}
        onLoad={mode === 'submit'}
      >
        <div className='model-name'>{camelize(model_name)}</div>
        <div className='record-name'>{record_name}</div>
      </Header>
      <ViewTabBar
        mode={mode}
        revision={revision}
        view={view}
        current_tab={tab_name}
        onClick={browseToTab}
        recordName={record_name}
      />
      <ViewTab {
                 ...{ model_name, record_name, template, record, revision, mode, tab }
               } />
    </div>
  );
}

function browserStateOf({ model_name, record_name, tab_name }) {
  return (state) => {
    const template = selectTemplate(state, model_name);
    const record = selectDocument(state, model_name, record_name);
    const revision = selectRevision(state, model_name, record_name) || {};
    const view = selectView(state, model_name, template);
    const can_edit = selectIsEditor(state);

    const tab =
      view &&
      tab_name &&
      view.tabs.find(t => t.name == tab_name);

    return {
      template,
      revision,
      view,
      record,
      tab,
      can_edit,
      tab_name,
      record_name,
      model_name
    };
  };
}

function useEditActions(setMode, browserState) {
  const invoke = useActionInvoker();
  const { revision, model_name, template, record_name } = browserState;

  return {
    cancelEdits,
    approveEdits
  };

  function cancelEdits() {
    setMode('browse');
    invoke(discardRevision(record_name, model_name));
  }

  function postEdits() {
    setMode('submit');

    invoke(
      sendRevisions(
        model_name,
        template,
        { [record_name]: revision },
        () => setMode('browse'),
        () => setMode('edit')
      )
    );
  }

  function approveEdits() {
    if (Object.keys(revision).length > 0) postEdits();
    else cancelEdits();
  }
}

