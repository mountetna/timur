// Framework libraries.
import * as React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-modal';

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
    <span className="file-missing"> No file </span>
  ) : value instanceof File ? (
    <span className="file-upload">
      {' '}
      {value.name} ({value.type}){' '}
    </span>
  ) : value == STUB || value.path == STUB ? (
    <span className="file-blank"> Blank file </span>
  ) : (
    <a href={value.url}> {value.path} </a>
  );

class FileAttribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = {metis: false, error: false};
  }

  render() {
    let {
      mode,
      value,
      revised_value,
      document,
      template,
      attribute,
      reviseDocument
    } = this.props;
    let {metis} = this.state;

    if (mode != 'edit')
      return (
        <div className="attribute file">
          <FileValue value={value} />
        </div>
      );

    let buttons = [
      // { type: 'upload',
      //   click: () => this.input.click(),
      //   title: 'Upload a file from your computer' },
      {
        type: 'cloud',
        click: () => this.setState({metis: true}),
        title: 'Link a file from Metis'
      },
      {
        type: 'stub',
        click: () =>
          reviseDocument(
            document,
            template,
            attribute,
            this.formatFileRevision(STUB)
          ),
        title: 'Mark this file as blank'
      },
      {
        type: 'remove',
        click: () =>
          reviseDocument(
            document,
            template,
            attribute,
            this.formatFileRevision(null)
          ),
        title: 'Remove this file link'
      }
    ];

    return (
      <div className="attribute file">
        <input
          type="file"
          style={{display: 'none'}}
          ref={(input) => (this.input = input)}
          onChange={(e) => this.getTempUrl(e)}
        />
        {metis && this.metisSelector()}
        <ButtonBar className="file-buttons" buttons={buttons} />
        <FileValue value={revised_value} />
      </div>
    );
  }

  metisSelector() {
    // TODO: would be nice to make this like a folder / file search
    let {error} = this.state;

    return (
      <Modal
        isOpen={this.state.metis}
        contentLabel="Enter Metis path"
        style={customStyles}
        onRequestClose={this.closeModal}
        appElement={document.querySelector('#root')}
      >
        <div className="attribute modal file-metis-select">
          <h2>Enter a Metis path</h2>
          <div className="input-box-wrapper">
            <label htmlFor="metis-path-input">Metis path:</label>
            <input
              id="metis-path-input"
              className="full_text metis-path-input"
              type="text"
              ref={(metis_file) => (this.metis_file = metis_file)}
              placeholder="metis://<project>/<bucket>/<file-path>"
            />
            <div className="modal-button-wrapper">
              <ButtonBar
                className="modal-buttons"
                buttons={[
                  {type: 'check', click: () => this.selectMetisFile()},
                  {type: 'cancel', click: () => this.setState({metis: false})}
                ]}
              />
              {error ? (
                <p className="file-metis-error">Invalid Metis path</p>
              ) : (
                ''
              )}
              <a
                className="modal-help"
                href="https://mountetna.github.io/timur.html"
              >
                Help
              </a>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  closeModal() {
    this.setState({metis: false});
  }

  selectMetisFile() {
    let {document, template, attribute, reviseDocument} = this.props;
    let {value} = this.metis_file;

    if (!METIS_PATH_MATCH(value)) {
      this.setState({error: true});
      return;
    } else {
      this.setState({error: false, metis: false});
    }

    this.metis_file.value = '';

    reviseDocument(
      document,
      template,
      attribute,
      this.formatFileRevision(value)
    );
  }

  formatFileRevision(value) {
    return {path: value};
  }

  getTempUrl(e) {
    e.preventDefault();
    let {document, template, attribute, getRevisionTempUrl} = this.props;

    getRevisionTempUrl(
      document,
      template,
      attribute,
      this.formatFileRevision(TEMP)
    ).then((res) => {
      console.log(res);
      // Here upload file to Metis, then call reviseDocument
    });
  }
}

export default connect(null, {reviseDocument, getRevisionTempUrl})(
  FileAttribute
);
