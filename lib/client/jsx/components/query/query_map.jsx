import React, {useContext, useEffect, useState} from 'react';

import {selectModelNames} from 'etna-js/selectors/magma';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {requestModels} from 'etna-js/actions/magma_actions';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

import ModelMapGraphic from '../model_map/model_map_graphic';
import QueryAttributesModal from './query_attributes_modal';
import {QueryContext} from '../../contexts/query/query_context';

function modelIsClickable(model_name) {
  // Should be in some Path library? The project model
  //   shouldn't be queryable in this page, since there's ever
  //   only a single record.
  return model_name !== 'project';
}

export default function QueryMap({}) {
  // Differences with the Map are
  //   1) Cannot click on project
  //   2) handler should bring up an attribute-selection modal.

  const {state, setAttributes} = useContext(QueryContext);
  const invoke = useActionInvoker();
  const [open, setOpen] = useState(false);
  const [modelName, setModelName] = useState(null);

  let modelNames = useReduxState((state) => selectModelNames(state));

  useEffect(() => {
    invoke(requestModels());
  }, []);

  function onClickModel(model_name) {
    if (modelIsClickable(model_name)) {
      setModelName(model_name);
      setOpen(true);
    }
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <div className='query-map'>
      <div className='map'>
        <ModelMapGraphic
          disabled_models={modelNames.filter((name) => !modelIsClickable(name))}
          selected_models={
            state.attributes ? Object.keys(state.attributes) : []
          }
          handler={onClickModel}
        />
      </div>
      {open ? (
        <QueryAttributesModal
          onClose={handleClose}
          open={open}
          model_name={modelName}
          attributes={state.attributes ? state.attributes[modelName] || [] : []}
          setAttributes={setAttributes}
        />
      ) : null}
    </div>
  );
}
