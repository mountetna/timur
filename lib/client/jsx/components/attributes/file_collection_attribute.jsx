import React, {useState, useEffect, useRef, useMemo} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

import {selectUploads} from 'etna-js/selectors/directory-selector';
import {TEMP} from './file_attribute';

import {reviseDocument} from '../../actions/magma_actions';

import FileListInput from '../inputs/file_list_input';
import ListInput from '../inputs/list_input';
import FileInput from '../inputs/file_input';

const FileCollectionValue = ({value}) =>
  value instanceof File ? (
    <span className='list_item file-upload'>
      {' '}
      {value.name} ({value.type}){' '}
    </span>
  ) : value === TEMP || value.path === TEMP ? (
    <span className='list_item file-blank'>
      {' '}
      {value.original_files[0].name}{' '}
    </span>
  ) : (
    <a href={value.url}> {value.original_filename} </a>
  );

export default function FileCollectionAttribute(props) {
  let {mode, value, revised_value} = props;

  const browserState = useReduxState(browserStateOf());
  const {uploads} = browserState;

  const {callReviseDocument} = useFileCollectionActions(props);

  // useEffect(() => {
  //   const updatedUpload = selectUploadForRevision(
  //     uploads,
  //     model_name,
  //     record_name,
  //     attribute.attribute_name
  //   );

  //   if (!updatedUpload) {
  //     setUpload(null);
  //     return;
  //   }

  //   if (updatedUpload.status !== 'complete') {
  //     setUpload(updatedUpload);
  //   } else if (upload) {
  //     let {project_name, bucket_name, file_name} = filePathComponents(
  //       upload.url
  //     );
  //     invoke(
  //       sendRevisions(model_name, {
  //         [record_name]: {
  //           [attribute.attribute_name]: {
  //             path: `metis://${project_name}/${bucket_name}/${file_name}`,
  //             original_filename: upload.original_filename
  //           }
  //         }
  //       })
  //     );
  //     setUpload(null);
  //   }
  // }, [uploads]);

  // useEffect(() => {
  //   // console.log('previous_value being set to', value);
  //   setPreviousValue(value);
  // }, []);
  var collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base'
  });

  if (mode != 'edit') {
    const sortedCollection = useMemo(
      () =>
        [...(value || [])].sort((a, b) => {
          // `path` should be the index-ordered, Magma generated name.
          // `original_filename` would be the user-selected file name.
          return collator.compare(a.path, b.path);
        }),
      [value]
    );
    console.log('value', value);
    console.log('sortedCollection', sortedCollection);
    return (
      <div className='attribute'>
        <div className='collection'>
          {sortedCollection.map((single_file) => (
            <div key={single_file} className='collection_item'>
              <FileCollectionValue value={single_file} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const sortedRevisedCollection = useMemo(
    () =>
      [...(revised_value || [])].sort((a, b) => {
        // `path` should be the index-ordered, Magma generated name.
        // `original_filename` would be the user-selected file name.
        return collator.compare(a.path, b.path);
      }),
    [revised_value]
  );

  console.log('sortedRevisedCollection', sortedRevisedCollection);

  return (
    <div className='attribute file-collection list_input'>
      <div>
        <ListInput
          placeholder='Upload or Link File'
          className='link_text'
          values={sortedRevisedCollection || []}
          itemInput={FileInput}
          onChange={(files) => {
            callReviseDocument(files);
          }}
        />
      </div>
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

function useFileCollectionActions(props) {
  const invoke = useActionInvoker();

  return {
    callReviseDocument
  };

  function callReviseDocument(files) {
    // ListInput automatically calls onChange with [""] when the user clicks
    //    the + button to add a new entry, to create a stub entry.
    // We don't need that behavior here, because we only create
    //    entries if the user subsequently clicks either the
    //    upload button or the Metis path button. So we remove
    //    all "" entries from `files`.
    console.log('files', files);

    files = files.filter((file) => {
      return '' !== file;
    });

    let {document, template, attribute} = props;

    invoke(reviseDocument(document, template, attribute, files));
  }
}
