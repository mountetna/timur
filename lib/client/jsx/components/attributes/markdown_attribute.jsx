// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

// Module imports.
import { reviseDocument } from 'etna-js/actions/magma_actions';
import MarkdownViewer from '../markdown_viewer';

const MarkdownAttribute = ({ value, revised_value, mode,
  reviseDocument, document, template, attribute }) => {
  if (mode != 'edit') {
    if (!value) return <div className='attribute' />;

    return <div className='attribute'>
      <MarkdownViewer text={ value }/>
    </div>;
  }

  return(
    <div className='attribute'>
      <textarea className='text_box'
        onChange={ (e) => reviseDocument(document, template, attribute, e.target.value) }
        defaultValue={ revised_value } />
    </div>
  );
}

export default connect(
  // map state
  null,
  // map dispatch
  { reviseDocument }
)(MarkdownAttribute);
