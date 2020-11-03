// Framework libraries.
import React, {useState, useEffect, useRef} from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';

import {
  reviseDocument,
  getRevisionTempUrl,
  fetchTempUrl
} from '../../actions/magma_actions';
import ButtonBar from '../button_bar';
import Icon from '../icon';

export const STUB = '::blank';
export const TEMP = '::temp';

// metis:\/\/([^\/]*?)\/([^\/]*?)\/(.*)$
const METIS_PATH_MATCH = (path) =>
  new RegExp(
    '^metis://' +
      // project_name
      '([^/]*?)/' +
      // bucket_name
      '([^/]*?)/' +
      // folder path + filename
      '(.*)$'
  ).test(path);

// We don't have a lot of content, so let's get a smaller Modal
const customStyles = {
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
  const fileInputRef = useRef(null);

  const {
    metisSelector,
    closeModal,
    selectMetisFile,
    formatFileRevision,
    setTempRevision
  } = useFileActions(metis, error, setMetis, setError, props);

  let {mode, value, revised_value, document, template, attribute} = props;

  if (mode != 'edit')
    return (
      <div className='attribute file'>
        <FileValue value={value} />
      </div>
    );

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

  // const browserState = useReduxState(
  //   browserStateOf({model_name, record_name, tab_name})
  // );
  // const {view, record, tab, revision, template, can_edit} = browserState;
  // const [mode, setMode] = useState('loading');
  // const loading = !view || !template || !record || !tab_name;
  // const {cancelEdits, approveEdits} = useEditActions(setMode, browserState);
  // const {selectOrShowTab, selectDefaultTab, selectTab, showTab} = useTabActions(
  //   browserState,
  //   setMode
  // );
}

// class FileAttribute extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {metis: false, error: false};
//   }

//   render() {
//     let {
//       mode,
//       value,
//       revised_value,
//       document,
//       template,
//       attribute,
//       reviseDocument
//     } = this.props;
//     let {metis} = this.state;
//     console.log('revised value', revised_value);
//     if (mode != 'edit')
//       return (
//         <div className='attribute file'>
//           <FileValue value={value} />
//         </div>
//       );

//     let buttons = [
//       {
//         type: 'upload',
//         click: () => this.input.click(),
//         title: 'Upload a file from your computer'
//       },
//       {
//         type: 'cloud',
//         click: () => this.setState({metis: true}),
//         title: 'Link a file from Metis'
//       },
//       {
//         type: 'stub',
//         click: () =>
//           reviseDocument(
//             document,
//             template,
//             attribute,
//             this.formatFileRevision(STUB)
//           ),
//         title: 'Mark this file as blank'
//       },
//       {
//         type: 'remove',
//         click: () =>
//           reviseDocument(
//             document,
//             template,
//             attribute,
//             this.formatFileRevision(null)
//           ),
//         title: 'Remove this file link'
//       }
//     ];

//     return (
//       <div className='attribute file'>
//         <input
//           type='file'
//           style={{display: 'none'}}
//           ref={(input) => (this.input = input)}
//           onChange={this.setTempRevision}
//         />
//         {metis && this.metisSelector()}
//         <ButtonBar className='file-buttons' buttons={buttons} />
//         <FileValue value={revised_value} />
//       </div>
//     );
//   }
// }

function useFileActions(metis, error, setMetis, setError, props) {
  const invoke = useActionInvoker();
  const metisPathRef = useRef(null);

  return {
    metisSelector,
    closeModal,
    selectMetisFile,
    formatFileRevision,
    setTempRevision
  };

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
    return {path: value};
  }

  function setTempRevision(e) {
    e.preventDefault();
    console.log('about to call reviseDocument');
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
