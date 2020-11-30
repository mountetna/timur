import React, {useRef, useState} from 'react';

import {useFileInputActions} from '../../actions/file_actions';

import ButtonBar from '../button_bar';

const FileInput = ({header, onBlur, onChange}) => {
  const [metis, setMetis] = useState(false);
  const [error, setError] = useState(false);
  const fileInputRef = useRef(null);

  const {metisSelector, setTempRevision} = useFileInputActions(
    metis,
    error,
    setMetis,
    setError,
    onChange,
    onBlur
  );

  let buttons = [
    // {
    //   type: 'upload',
    //   click: () => fileInputRef.current.click(),
    //   title: 'Upload a file from your computer'
    // },
    {
      type: 'cloud',
      click: () => setMetis(true),
      title: 'Link a file from Metis'
    }
  ];

  return (
    <div className='fi-group'>
      <label className='fi-label'>{header}</label>
      <input
        type='file'
        style={{display: 'none'}}
        ref={fileInputRef}
        onChange={setTempRevision}
      />
      {metis && metisSelector()}
      <ButtonBar className='fi-buttons file-buttons' buttons={buttons} />
    </div>
  );
};

export default FileInput;
