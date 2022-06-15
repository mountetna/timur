import React, {useState, useEffect, useRef, useMemo} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

import {selectUploads} from 'etna-js/selectors/directory-selector';

import {TEMP} from 'etna-js/actions/file_actions';
import {reviseDocument} from 'etna-js/actions/magma_actions';
import {filePathComponents} from 'etna-js/selectors/magma';

import ListInput from 'etna-js/components/inputs/list_input';
import FileInput from 'etna-js/components/inputs/file_input';

const FileCollectionValue = ({value, predicate}) =>
  value instanceof File ? (
    <span className='list_item file-upload'>
      {' '}
      {value.name} ({value.type}){' '}
    </span>
  ) : 'md5' === predicate ? (
    <span className=''> {value} </span>
  ) : value === TEMP || value.path === TEMP ? (
    <span className='list_item file-blank'>
      {' '}
      {value.original_files[0].name}{' '}
    </span>
  ) : (
    <a href={value.url}> {value.original_filename || value.path} </a>
  );

export default function FileCollectionAttribute(props) {
  let {mode, value, revised_value, predicate} = props;

  const browserState = useReduxState(browserStateOf());
  const {uploads} = browserState;

  const {callReviseDocument} = useFileCollectionActions(props);

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

    return (
      <div className='attribute'>
        <div className='collection'>
          {sortedCollection.map((single_file) => (
            <div key={single_file.url} className='collection_item'>
              <FileCollectionValue value={single_file} predicate={predicate} />
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

  return (
    <div className='attribute file-collection list_input'>
      <div>
        <ListInput
          placeholder='Link Files'
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
    let {document, template, attribute} = props;

    // The record format for files is different than the
    //   update format, so we have to account for that here.
    files = formatFileCollectionRevisions(files);

    invoke(reviseDocument(document, template, attribute, files));
  }

  function formatFileCollectionRevisions(files) {
    // Need to reformat {original_filename: '', path: '', url: ''} to
    //   {original_filename: '', path: 'metis://<path>'} while taking
    //   the bucket and project information for the new `path`
    //   from the download URL.
    let updatedFiles = [];
    files.forEach((file) => {
      if ('' === file) {
        // Don't re-calculate for new element stub
        updatedFiles.push(file);
      } else if (!file.hasOwnProperty('url')) {
        // Also for newly input files, they already have a valid Metis Path
        updatedFiles.push(file);
      } else {
        let {project_name, bucket_name, file_name} = filePathComponents(
          file.url
        );

        updatedFiles.push({
          original_filename: file.original_filename,
          path: `metis://${project_name}/${bucket_name}/${file_name}`
        });
      }
    });

    return updatedFiles;
  }
}
