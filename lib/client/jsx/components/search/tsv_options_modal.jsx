import React, {useState} from 'react';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useModal} from 'etna-js/components/ModalDialogContainer';
import {requestTSV} from 'etna-js/actions/magma_actions';
import DisabledButton from './disabled_button';

import {
  selectSearchFilterString,
  selectSearchShowDisconnected,
  selectSortedAttributeNames,
  selectSearchOutputPredicate
} from '../../selectors/search';

export default function TsvOptionsModal({selectedModel}) {
  const [expandMatrices, setExpandMatrices] = useState(false);
  const [transpose, setTranspose] = useState(false);
  const {dismissModal} = useModal();

  const invoke = useActionInvoker();

  const {
    show_disconnected,
    attribute_names,
    output_predicate,
    filter_string
  } = useReduxState((state) => {
    return {
      show_disconnected: selectSearchShowDisconnected(state),
      attribute_names: selectSortedAttributeNames(state),
      output_predicate: selectSearchOutputPredicate(state),
      filter_string: selectSearchFilterString(state)
    };
  });

  function onDownload() {
    console.log('transpose', transpose, 'expand', expandMatrices);
    invoke(
      requestTSV({
        model_name: selectedModel,
        filter: filter_string,
        attribute_names,
        show_disconnected,
        output_predicate,
        expand_matrices: expandMatrices,
        transpose
      })
    );
    invoke(dismissModal());
  }

  return (
    <div className='tsv-options-modal'>
      <div className='header'>TSV Download Options</div>
      <div className='options-tray tray'>
        <label className='expand-matrices'>
          <input
            checked={!!expandMatrices}
            onChange={() => setExpandMatrices(!expandMatrices)}
            type='checkbox'
          />{' '}
          Expand matrices
        </label>
        <label className='transpose'>
          <input
            checked={!!transpose}
            onChange={() => setTranspose(!transpose)}
            type='checkbox'
          />{' '}
          Transpose
        </label>
      </div>
      <div className='options-action-wrapper'>
        <DisabledButton
          id='download-tsv-btn'
          label={'\u21af Download'}
          disabled={false}
          onClick={() => onDownload()}
        />
      </div>
    </div>
  );
}
