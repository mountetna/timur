// Framework libraries.
import React, {useState, useEffect, useRef} from 'react';
import Modal from 'react-modal';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

import {
  selectUploadForRevision,
  selectUploads
} from 'etna-js/selectors/directory-selector';
import ListUpload from 'etna-js/upload/components/list-upload';
import {reviseDocument, sendRevisions} from '../../actions/magma_actions';
import ButtonBar from '../button_bar';
import Icon from '../icon';
import {filePathComponents} from '../../selectors/magma';

const COLUMNS = [
  {name: 'type', width: '60px'},
  {name: 'name', width: '60%'},
  {name: 'status', width: '90px', hide: true},
  {name: 'updated', width: '30%'},
  {name: 'size', width: '10%'},
  {name: 'control', width: '100px', hide: true}
];

const COLUMN_WIDTHS = COLUMNS.reduce((widths, column) => {
  widths[column.name] = column.width;
  return widths;
}, {});

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

const FileValue = ({value}) =>
  !value ? (
    <span className='file-missing'> No file </span>
  ) : value instanceof File ? (
    <span className='file-upload'>
      {' '}
      {value.name} ({value.type}){' '}
    </span>
  ) : value === STUB || value.path === STUB ? (
    <span className='file-blank'> Blank file </span>
  ) : value === TEMP || value.path === TEMP ? (
    <span className='file-blank'> {value.original_files[0].name} </span>
  ) : (
    <a href={value.url}> {value.path} </a>
  );

export default function FileAttribute(props) {
  const invoke = useActionInvoker();
  const [metis, setMetis] = useState(false);
  const [error, setError] = useState(false);
  const [upload, setUpload] = useState(null);
  const [previous_value, setPreviousValue] = useState(null);
  const fileInputRef = useRef(null);

  const {
    metisSelector,
    formatFileRevision,
    setTempRevision,
    isTempRevision
  } = useFileActions(metis, error, setMetis, setError, props);

  let {
    mode,
    value,
    revised_value,
    document,
    template,
    attribute,
    model_name,
    record_name
  } = props;

  const browserState = useReduxState(browserStateOf());
  const {uploads} = browserState;

  useEffect(() => {
    const updatedUpload = selectUploadForRevision(
      uploads,
      model_name,
      record_name,
      attribute.attribute_name
    );

    if (!updatedUpload) {
      setUpload(null);
      return;
    }

    if (updatedUpload.status !== 'complete') {
      setUpload(updatedUpload);
    } else if (upload) {
      let {project_name, bucket_name, file_name} = filePathComponents(
        upload.url
      );
      invoke(
        sendRevisions(model_name, {
          [record_name]: {
            [attribute.attribute_name]: {
              path: `metis://${project_name}/${bucket_name}/${file_name}`,
              original_filename: upload.original_filename
            }
          }
        })
      );
      setUpload(null);
    }
  }, [uploads]);

  useEffect(() => {
    // console.log('previous_value being set to', value);
    setPreviousValue(value);
  }, []);

  if (mode != 'edit') {
    if (upload) {
      return (
        <div className='attribute file'>
          <ListUpload
            widths={COLUMN_WIDTHS}
            upload={upload}
            override_name={upload.original_filename}
          />
        </div>
      );
    } else if (isTempRevision(revised_value) && previous_value) {
      return (
        <div className='attribute file'>
          <FileValue value={previous_value} />
        </div>
      );
    } else {
      return (
        <div className='attribute file'>
          <FileValue value={value} />
        </div>
      );
    }
  }

  let buttons = [
    {
      type: 'upload',
      click: () => fileInputRef.current.click(),
      title: 'Upload a file from your computer'
    },
    {
      type: 'cloud',
      click: () => setMetis(true),
      title: 'Link a file from Metis'
    },
    {
      type: 'stub',
      click: () =>
        invoke(
          reviseDocument(
            document,
            template,
            attribute,
            formatFileRevision(STUB)
          )
        ),
      title: 'Mark this file as blank'
    },
    {
      type: 'remove',
      click: () =>
        invoke(
          reviseDocument(
            document,
            template,
            attribute,
            formatFileRevision(null)
          )
        ),
      title: 'Remove this file link'
    }
  ];

  return (
    <div className='attribute file'>
      <input
        type='file'
        style={{display: 'none'}}
        ref={fileInputRef}
        onChange={setTempRevision}
      />
      {metis && metisSelector()}
      <ButtonBar className='file-buttons' buttons={buttons} />
      <FileValue value={revised_value} />
    </div>
  );
}

function browserStateOf() {
  return (state) => {
    const uploads = selectUploads(state);
    return {
      uploads
    };
  };
}

function useFileActions(metis, error, setMetis, setError, props) {
  const invoke = useActionInvoker();
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
    let {document, template, attribute} = props;

    const metisPath = metisPathRef.current.value;

    if (!METIS_PATH_MATCH(metisPath)) {
      setError(true);
      return;
    } else {
      setError(false);
      setMetis(false);
    }

    invoke(
      reviseDocument(
        document,
        template,
        attribute,
        formatFileRevision(metisPath)
      )
    );

    metisPathRef.current.value = null;
  }

  function formatFileRevision(value) {
    let file_parts = value.split('/');
    let revision = {path: value};

    if (STUB !== value && TEMP !== value) {
      revision['original_filename'] = file_parts[file_parts.length - 1];
    }

    return revision;
  }

  function setTempRevision(e) {
    e.preventDefault();

    let {document, template, attribute} = props;
    invoke(
      reviseDocument(
        document,
        template,
        attribute,
        Object.assign(formatFileRevision(TEMP), {
          original_files: e.target.files
        })
      )
    );
  }
}
