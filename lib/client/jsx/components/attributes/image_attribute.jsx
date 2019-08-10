// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';

const ImageAttribute = ({ mode, value,
  document, template, attribute, reviseDocument }) => {

  if (mode != "edit") {
    return <div className='attribute'> {
      value
        ? <a href={ value.url } ><img src={ value.thumb }/></a>
        : <div className="document_empty">No file.</div>
    } </div>
  }

  return(
    <div className='attribute'>
      <input
        type='file'
        onChange={
          e => reviseDocument(document, template, attribute, e.target.files[0])
        }
      />
    </div>
  );
}

export default ReactRedux.connect(
  null,
  {reviseDocument}
)(ImageAttribute);
