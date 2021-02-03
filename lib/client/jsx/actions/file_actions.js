import React, {useRef, useState} from 'react';
import Modal from 'react-modal';

import ButtonBar from '../components/button_bar';
import Icon from '../components/icon';

export const STUB = '::blank';
export const TEMP = '::temp';

// We don't have a lot of content, so let's get a smaller Modal
export const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    minWidth: '40%',
    transform: 'translate(-50%, -50%)'
  }
};

// metis:\/\/([^\/]*?)\/([^\/]*?)\/(.*)$
export const METIS_PATH_MATCH = (path) =>
  new RegExp(
    '^metis://' +
      // project_name
      '([^/]*?)/' +
      // bucket_name
      '([^/]*?)/' +
      // folder path + filename
      '(.*)$'
  ).test(path);

export const useFileInputActions = (
  metis,
  error,
  setMetis,
  setError,
  onChange,
  onBlur
) => {
  const metisPathRef = useRef(null);

  return {
    metisSelector,
    closeModal,
    selectMetisFile,
    formatFileRevision,
    setTempRevision,
    isTempRevision
  };

  function isTempRevision(revision) {
    if (!(revision && revision.path)) return false;

    return (
      revision.path.indexOf('/upload/') > -1 &&
      revision.path.indexOf('X-Etna-Signature') > -1
    );
  }

  function metisSelector() {
    // TODO: would be nice to make this like a folder / file search
    return (
      <Modal
        isOpen={metis}
        contentLabel='Enter Metis path'
        style={customStyles}
        onRequestClose={closeModal}
        appElement={document.querySelector('#root')}
      >
        <div className='attribute modal file-metis-select'>
          <h2>Enter a Metis path</h2>
          <div className='input-box-wrapper'>
            <label htmlFor='metis-path-input'>Metis path:</label>
            <input
              id='metis-path-input'
              className='full_text metis-path-input'
              type='text'
              ref={metisPathRef}
              placeholder='metis://<project>/<bucket>/<file-path>'
            />
            <div className='modal-button-wrapper'>
              <ButtonBar
                className='modal-buttons'
                buttons={[
                  {type: 'check', click: () => selectMetisFile()},
                  {type: 'cancel', click: () => setMetis(false)}
                ]}
              />
              {error ? (
                <p className='file-metis-error'>Invalid Metis path</p>
              ) : (
                ''
              )}
              <div className='modal-buttons pull-right'>
                <Icon
                  className=''
                  icon='question-circle'
                  title='Help'
                  onClick={() =>
                    window.open(
                      'https://mountetna.github.io/timur.html#managing-data-files',
                      '_blank'
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  function closeModal() {
    setMetis(false);
  }

  function selectMetisFile() {
    const metisPath = metisPathRef.current.value;

    if (!METIS_PATH_MATCH(metisPath)) {
      setError(true);
      return;
    } else {
      setError(false);
      setMetis(false);
    }

    onChange(formatFileRevision(metisPath));
    onBlur();

    metisPathRef.current.value = null;
  }

  function formatFileRevision(newValue, files) {
    if (null === newValue) return {path: newValue};

    let file_parts = newValue.split('/');
    let revision = {path: newValue};

    if (STUB !== newValue && TEMP !== newValue && !files) {
      revision['original_filename'] = file_parts[file_parts.length - 1];
    }
    if (files && TEMP === newValue) {
      revision['original_files'] = files;
    }

    return revision;
  }

  function setTempRevision(e) {
    e.preventDefault();

    onChange(formatFileRevision(TEMP, e.target.files));
    onBlur();
  }
};
