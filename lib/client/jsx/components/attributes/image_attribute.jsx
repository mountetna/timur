// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import FileAttribute from './file_attribute';
import {STUB} from 'etna-js/actions/file_actions';

const ImageAttribute = (props) => {
  let {mode, value} = props;
  console.log('mode, value', mode, value);
  if (
    mode != 'edit' &&
    value &&
    value !== STUB &&
    value.path !== STUB &&
    value.url
  ) {
    console.log('here');
    return (
      <a href={value.url}>
        <img className='image-thumbnail' src={`${value.url}&thumbnail=true`} />
      </a>
    );
  }

  return <FileAttribute {...props} />;
};

export default ReactRedux.connect(null, null)(ImageAttribute);
