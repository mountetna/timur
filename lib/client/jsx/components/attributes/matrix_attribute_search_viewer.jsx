import React from 'react';
import {useModal} from 'etna-js/components/ModalDialogContainer';
import MatrixAttributeFilter from './matrix_attribute_filter';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectSearchOutputPredicate} from '../../selectors/search';

export default function MatrixAttributeSearchViewer(props) {
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

  const sliceRegex = /^(\w+)\[\](.+)$/;

  let isSliced = outputPredicate.find((p) => {
    let match = p.match(sliceRegex);
    if (!match) return false;

    return match[1] === attribute.attribute_name;
  });

  let viewAttribute = isSliced
    ? {...attribute, options: isSliced.match(sliceRegex)[2].split(',')}
    : attribute;

  return (
    <div className='matrix-data-modal'>
      <div className='matrix-data-modal-header'>
        {attribute.display_name} for {record[template.identifier]}
      </div>
      <MatrixAttributeFilter attribute={viewAttribute} row={row} />
    </div>
  );
}
