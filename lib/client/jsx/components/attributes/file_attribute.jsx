// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import ButtonBar from '../button_bar';
import Icon from '../icon';

export const STUB = '::blank';
const FILENAME_MATCH='[^<>:;,?"*\\|\\/\\x00-\\x1f]+';

// metis:\/\/([^\/]*?)\/([^\/]*?)\/(.*)$
const METIS_PATH_MATCH = (path) => new RegExp(
  '^metis:\/\/' +
  // project_name
  '([^\/]*?)\/' +
  // bucket_name
  '([^\/]*?)\/' +
  // folder path + filename
  '(.*)$'
).test(path);

const FileValue = ({value}) =>
  !value ? <span className="file-missing"> No file  </span>
    : value instanceof File ? <span className='file-upload'> { value.name } ({value.type}) </span>
    : value == STUB || value.path == STUB ? <span className="file-blank"> Blank file  </span>
    : <a href={ value.url } > { value.path } </a>;

class FileAttribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = { metis: false, error: false }
  }

  render() {
    let { mode, value, revised_value, document, template, attribute,
      reviseDocument } = this.props;
    let { metis } = this.state;

    if (mode != "edit") return(
      <div className='attribute file'>
        <FileValue value={value}/>
      </div>
    );

    let buttons = [
      { type: 'upload',
        click: () => this.input.click(),
        title: 'Upload a file from your computer' },
      { type: 'cloud',
        click: () => this.setState({ metis: true }),
        title: 'Link a file from Metis' },
      { type: 'stub',
        click: () => reviseDocument(document, template, attribute, this.formatFileRevision(STUB)),
        title: 'Mark this file as blank' },
      { type: 'remove',
        click: () => reviseDocument(document, template, attribute, this.formatFileRevision(null)),
        title: 'Remove this file link' }
    ];

    return(
      <div className='attribute file'>
        <input type='file'
          style={{ display: 'none' }}
          ref={ input => this.input = input }
          onChange={ e => reviseDocument(
            document, template, attribute, this.formatFileRevision(e.target.files[0])
          ) } />
        { metis && this.metisSelector() }
        <ButtonBar className='file-buttons' buttons={buttons} />
        <FileValue value={revised_value}/>
      </div>
    )
  }

  metisSelector() {
    // TODO: would be nice to make this like a folder / file search
    let { error } = this.state;

    return <div className='file-metis-select'>
      <input type='text'
        ref={ metis_file => this.metis_file = metis_file }
        placeholder='Enter Metis path'/>
      <ButtonBar className='file-buttons' buttons={[
        { type: 'check', click: () => this.selectMetisFile() }
      ]} />
      { error
          ? <p className='file-metis-error'>Invalid Metis path</p>
          : '' }
    </div>;
  }

  selectMetisFile() {
    let { document, template, attribute, reviseDocument } = this.props;
    let { value } = this.metis_file;

    if (!METIS_PATH_MATCH(value)) {
      this.setState({error: true});
      return;
    } else {
      this.setState({error: false, metis: false})
    }

    this.metis_file.value = '';

    reviseDocument(document, template, attribute, this.formatFileRevision(value));
  }

  formatFileRevision(value) {
    return {path: value};
  }
}


export default connect(
  null,
  { reviseDocument }
)(FileAttribute);
