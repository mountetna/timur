import React from 'react';
import {QueryContext} from '../../contexts/query/query_context';

import {useModal} from 'etna-js/components/ModalDialogContainer';

export default function QueryAttributesModal({model_name}) {
  const {dismissModal} = useModal();

  return <div className='query-attributes-modal'>{model_name} attributes!</div>;
}
