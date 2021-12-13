import React, {useState} from 'react';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useModal} from 'etna-js/components/ModalDialogContainer';
import {requestTSV} from 'etna-js/actions/magma_actions';

import TsvOptionsModal from './tsv_options_modal';

import {
  selectSearchFilterString,
  selectSearchShowDisconnected,
  selectSortedAttributeNames,
  selectSearchOutputPredicate
} from '../../selectors/search';

export default function SearchTsvOptionsModal({selectedModel}) {
  const [expandMatrices, setExpandMatrices] = useState(false);
  const [transpose, setTranspose] = useState(false);
  const {dismissModal} = useModal();

  const invoke = useActionInvoker();

  const {show_disconnected, attribute_names, output_predicate, filter_string} =
    useReduxState((state) => {
      return {
        show_disconnected: selectSearchShowDisconnected(state),
        attribute_names: selectSortedAttributeNames(state),
        output_predicate: selectSearchOutputPredicate(state),
        filter_string: selectSearchFilterString(state)
      };
    });

  function onDownload() {
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

  const options = [
    {
      label: 'Expand matrices',
      onChange: setExpandMatrices,
      checked: !!expandMatrices
    },
    {
      label: 'Transpose',
      onChange: setTranspose,
      checked: !!transpose
    }
  ];

  return <TsvOptionsModal options={options} onDownload={onDownload} disabled={false} />;
}
