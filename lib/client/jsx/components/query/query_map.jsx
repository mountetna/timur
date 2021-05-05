import React, {useContext} from 'react';

import ModelMapGraphic from '../model_map/model_map_graphic';
import QueryAttributesModal from './query_attributes_modal';
import {QueryContext} from '../../contexts/query/query_context';

import {useModal} from 'etna-js/components/ModalDialogContainer';

function modelIsClickable(model_name) {
  // Should be in some Path library? Any model that is project or
  //   only attached to project should be disabled.
  return model_name !== 'project' && model_name !== 'document';
}

export default function QueryMap({}) {
  // Differences with the Map are
  //   1) Cannot click on project or models whose only
  //      relationship is to project.
  //   2) handler should bring up an attribute-selection modal.

  const {state, setModels} = useContext(QueryContext);

  let {models} = state;

  const {openModal} = useModal();

  function onClickModel(model_name) {
    if (modelIsClickable(model_name)) {
      // TODO: Only select the model if attributes for the given model are selected.
      setModels(
        models.includes(model_name)
          ? models.filter((m) => model_name !== m)
          : models.concat([model_name])
      );
      openModal(<QueryAttributesModal model_name={model_name} />);
    }
  }

  return (
    <div className='query-map'>
      <div className='map'>
        <ModelMapGraphic
          disabled_models={['project', 'document']}
          selected_models={state.models}
          handler={onClickModel}
        />
      </div>
    </div>
  );
}
