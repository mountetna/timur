import React from 'react';
import {useModal} from 'etna-js/components/ModalDialogContainer';
import MatrixAttributeFilterTable from './matrix_attribute_filter_table';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectSearchOutputPredicate} from '../../selectors/search';

function MatrixDataModal({attribute, row, record, template, sliceRequired}) {
  // We have to make sure to only show the options that were
  //   sliced, if an output predicate was set.
  const outputPredicate = useReduxState((state) =>
    selectSearchOutputPredicate(state)
  );

  const sliceRegex = /^(\w+)\[\](.+)$/;

  let isSliced = !sliceRequired ? false : outputPredicate.find((p) => {
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
      <MatrixAttributeFilterTable attribute={viewAttribute} row={row} />
    </div>
  );
}

export default function MatrixAttributeSearchViewer(props) {
  const {openModal} = useModal();

  const openMatrixContainer = () => {
    openModal(<MatrixDataModal {...props} />);
  };

  return (
    <a className='matrix-open-modal-btn pointer' onClick={openMatrixContainer}>
      View matrix row
    </a>
  );
}
