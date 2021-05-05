import React from 'react';

import ModelMapGraphic from '../model_map/model_map_graphic';

import {useModal} from 'etna-js/components/ModalDialogContainer';

export default function QueryMap({}) {
  // Differences with the Map are
  //   1) Cannot click on project or models whose only
  //      relationship is to project.
  //   2) handler should bring up an attribute-selection modal.

  const {openModal} = useModal();

  function onClickModel(model_name) {
    openModal(<QueryAttributesModal model_name={model_name} />);
  }

  return (
    <div className='query-map'>
      <div className='map'>
        <ModelMapGraphic handler={onClickModel} />
      </div>
    </div>
  );
}
