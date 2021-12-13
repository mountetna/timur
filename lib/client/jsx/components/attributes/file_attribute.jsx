// Framework libraries.
import React, {useState, useEffect, useRef} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

import {
  selectUploadForRevision,
  selectUploads
} from 'etna-js/selectors/directory-selector';
import ListUpload from 'etna-js/upload/components/list-upload';
import {STUB, TEMP, useFileInputActions} from 'etna-js/actions/file_actions';
import {reviseDocument, finalizeUpload} from 'etna-js/actions/magma_actions';
import ButtonBar from 'etna-js/components/button_bar';

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

  function onChange(revision) {
    invoke(reviseDocument(document, template, attribute, revision));
  }

  function onBlur() {
    // do nothing
  }

  const {metisSelector, formatFileRevision, setTempRevision, isTempRevision} =
    useFileInputActions(metis, error, setMetis, setError, onChange, onBlur);

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
      invoke(
        finalizeUpload(
          model_name,
          template,
          record_name,
          attribute.attribute_name,
          upload
        )
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
