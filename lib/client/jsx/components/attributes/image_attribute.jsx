// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import FileAttribute from './file_attribute';

const ImageAttribute = (props) => {
  // When we get thumbnails working, we can put this back into
  //   expose those.
  // if (mode != "edit") {
  //   return <div className='attribute'> {
  //     value
  //       ? <a href={ value.url } ><img src={ value.thumb }/></a>
  //       : <div className="document_empty">No file.</div>
  //   } </div>
  // }

  return <FileAttribute {...props} />;
};

export default ReactRedux.connect(null, null)(ImageAttribute);
