// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import FileAttribute, {STUB} from './file_attribute';

const ImageAttribute = (props) => {
  let {mode, value} = props;
  if (mode != 'edit') {
    return (
      <div className='attribute'>
        {' '}
        {value && value.path !== STUB ? (
          <a href={value.url}>
            <img
              className='image-thumbnail'
              src={`${value.url}&thumbnail=true`}
            />
          </a>
        ) : value && value.path === STUB ? (
          <span className='file-blank'> Blank file </span>
        ) : (
          <div className='document_empty'>No file</div>
        )}{' '}
      </div>
    );
  }

  return <FileAttribute {...props} />;
};

export default ReactRedux.connect(null, null)(ImageAttribute);
