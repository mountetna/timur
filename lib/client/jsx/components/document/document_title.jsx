import * as React from 'react';

import ButtonBar from '../button_bar';

const DocumentTitle = ({ name, editing, onChange, buttons }) => (
  <div className='document-title'>
    <input
      className={ `${!editing ? 'disabled' : 'editing'} document-title-input` }
      type='text'
      onChange={ onChange }
      disabled={ (!editing) ? 'disabled' : null }
      placeholder='No name'
      value={name||''}
      data-field='name' />
    <ButtonBar className='document-action-btn-group' buttons={buttons} />
    <span className='document-status'>
      {(editing) ? 'EDITING' : ''}
    </span>
  </div>
);

export default DocumentTitle;
