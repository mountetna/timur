// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import FileAttribute from './file_attribute';
import {STUB} from 'etna-js/actions/file_actions';

const ImageAttribute = (props) => {
  let {mode, value} = props;

  if (
    mode != 'edit' &&
    value &&
    value !== STUB &&
    value.path !== STUB &&
    value.url
  ) {
    return (
      <div className='attribute file image'>
        <a href={value.url}>
          <img
            className='image-thumbnail'
            src={`${value.url}&thumbnail=true`}
          />
        </a>
      </div>
    );
  }

  return <FileAttribute {...props} />;
};

export default ReactRedux.connect(null, null)(ImageAttribute);
