import React from 'react';
import {useModal} from 'etna-js/components/ModalDialogContainer';
import MatrixAttributeFilter from './matrix_attribute_filter';

export default function MatrixAttributeModal(props) {
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
  console.log('record', record);
  console.log('template', template);
  return (
    <div className='matrix-data-modal'>
      <div className='matrix-data-modal-header'>
        {attribute.display_name} for {record[template.identifier]}
      </div>
      <MatrixAttributeFilter attribute={attribute} row={row} />
    </div>
  );
}
