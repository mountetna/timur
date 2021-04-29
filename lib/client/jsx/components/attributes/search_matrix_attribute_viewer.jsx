import React from 'react';
import {useModal} from 'etna-js/components/ModalDialogContainer';
import MatrixAttributeFilter from './matrix_attribute_filter';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectSearchOutputPredicate} from '../../selectors/search';

export default function SearchMatrixAttributeViewer(props) {
  const {openModal} = useModal();

  const openMatrixContainer = () => {
    openModal(<MatrixDataModal {...props} />);
  };

  return (
    <a className='matrix-open-modal-btn pointer' onClick={openMatrixContainer}>
      View matrix data
    </a>
  );
}

function MatrixDataModal({attribute, row, record, template}) {
  // We have to make sure to only show the options that were
  //   sliced, if an output predicate was set.
  const outputPredicate = useReduxState((state) =>
    selectSearchOutputPredicate(state)
  );

  // TODO: update the attribute.options if the attribute.name
  //  appears in the outputPredicates list.


  return (
    <div className='matrix-data-modal'>
      <div className='matrix-data-modal-header'>
        {attribute.display_name} for {record[template.identifier]}
      </div>
      <MatrixAttributeFilter attribute={attribute} row={row} />
    </div>
  );
}
