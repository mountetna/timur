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
import {connect} from 'react-redux';

// Class imports.
import Header from '../header';
import {TabBarContainer as TabBar} from '../tab_bar';
import BrowserTab from './browser_tab';

// Module imports.
import {requestManifests} from '../../actions/manifest_actions';
import {requestPlots} from '../../actions/plot_actions';
import {setLocation} from '../../actions/location_actions';
import {applyView} from '../../actions/view_actions';
import {
  sendRevisions, discardRevision, requestAnswer
} from '../../actions/magma_actions';
import {
  interleaveAttributes,
  getAttributes,
  getDefaultTab,
  selectView
} from '../../selectors/tab_selector';
import {
  selectTemplate, selectDocument, selectRevision
} from '../../selectors/magma';
import {selectUserProjectRole} from '../../selectors/user_selector';
import {useReduxState} from "etna-js/hooks/useReduxState";
import {useActionInvoker} from "etna-js/hooks/useActionInvoker";
import {useRequestDocuments} from "../../hooks/useRequestDocuments";

const loadingDiv =
  <div className='browser'>
    <div id='loader-container'>
      <div className='loader'>
        Loading...
      </div>
    </div>
  </div>;

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
    return letter.toUpperCase();
  }).replace(/\s+/g, '');
}

export default function Browser({ model_name, record_name, tab_name }) {
  const invoke = useActionInvoker();
  const browserState = useReduxState(browserStateOf({ model_name, record_name, tab_name }));
  const { view, record, tab, revision, template, can_edit } = browserState;
  const [mode, setMode] = useState('loading');
  const loading = !view || !template || !record || !tab_name;
  const { cancelEdits, approveEdits } = useEditActions(setMode, browserState);
  const { selectOrShowTab, selectDefaultTab, selectTab, showTab } = useTabActions(browserState, setMode);

  // Set at 'skin' on the browser styling.
  let skin = 'browser';
  if (mode === 'browse') skin = 'browser ' + model_name;
  const editMode = useCallback(() => setMode('edit'), [setMode]);

  // On mount
  useEffect(() => {
    invoke(requestManifests());
    invoke(requestPlots());

    // Decide data that should be loaded immediately.
    if (!model_name && !record_name) {
      // ask magma for the project name
      invoke(requestAnswer(
        { query: ['project', '::first', '::identifier'] },

        // redirect there
        ({ answer }) => invoke(
          setLocation(
            Routes.browse_model_path(
              TIMUR_CONFIG.project_name,
              'project',
              answer
            )
          )
        )
      ));
    } else if (!view) {
      // we are told the model and record name, get the view
      invoke(applyView(
        model_name,
        selectOrShowTab
      ));
    } else if (!tab_name) {
      selectDefaultTab(view);
    } else {
      showTab(view);
    }
  }, [])

  if (loading) {
    return loadingDiv;
  }

  return (
    <div className={skin}>
      <Header
        onEdit={mode === 'browse' && can_edit && editMode}
        onSave={mode === 'edit' && approveEdits}
        onCancel={mode === 'edit' && cancelEdits}
        onLoad={mode === 'submit'}>
        <div className='model-name'>
          {camelize(model_name)}
        </div>
        <div className='record-name'>
          {record_name}
        </div>
      </Header>
      <TabBar
        mode={mode}
        revision={revision}
        view={view}
        current_tab={tab_name}
        onClick={selectTab}
      />
      <BrowserTab {
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
    const view = selectView(state, model_name);
    const role = selectUserProjectRole(state);

    const tab = view && tab_name && template && view.tabs[tab_name] && interleaveAttributes(
      view.tabs[tab_name],
      template
    );

    const can_edit = role === 'administrator' || role === 'editor';

    return {
      template,
      revision,
      view,
      record,
      role,
      tab,
      can_edit,
      tab_name,
      record_name,
      model_name
    };
  }
}

function useEditActions(setMode, browserState) {
  const invoke = useActionInvoker();
  const { revision, model_name, record_name } = browserState;

  return {
    cancelEdits,
    approveEdits,
  }


  function cancelEdits() {
    setMode('browse');
    invoke(discardRevision(
      record_name,
      model_name
    ));
  }

  function postEdits() {
    setMode('submit');
    invoke(sendRevisions(
      model_name,
      { [record_name]: revision },
      () => setMode('browse'),
      () => setMode('edit'),
    ));
  }

  function approveEdits() {
    if (Object.keys(revision).length > 0) postEdits();
    else cancelEdits();
  }
}

function useTabActions(browserState, setMode) {
  const { record, template, tab_name: currentTabName, model_name, record_name } = browserState;
  const invoke = useActionInvoker();
  const requestDocuments = useRequestDocuments();

  return {
    selectTab, selectDefaultTab, selectOrShowTab, showTab
  }

  function selectTab(tabName) {
    invoke(setLocation(window.location.href.replace(/#.*/, '') + `#${tabName}`));
  }

  function selectDefaultTab(view) {
    selectTab(getDefaultTab(view));
  }

  function selectOrShowTab(view) {
    if (currentTabName) showTab(view);
    else selectDefaultTab(view);
  }

  function showTab(view) {
    requestTabDocuments(view.tabs[currentTabName]);
    setMode('browse');
  }

  function requestTabDocuments(tab) {
    if (!tab) return;
    let exchange_name = `tab ${tab.name} for ${model_name} ${record_name}`;
    let attribute_names = getAttributes(tab);

    let hasAttributes = record && template && Array.isArray(attribute_names) && attribute_names.every(
      attr_name => !(attr_name in template.attributes) || (attr_name in record)
    );

    // ensure attribute data is present in the document
    if (!hasAttributes) {
      // or else make a new request
      requestDocuments({
        model_name, record_names: [record_name],
        attribute_names,
        exchange_name,
        success: () => setMode('browse'),
      })
    }
  }
}
