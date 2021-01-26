
// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from 'etna-js/actions/magma_actions';
import SlowTextInput from '../inputs/slow_text_input';
import MagmaLink from '../magma_link';

const IdentifierAttribute = ({ mode, value, revised_value,
  document, template, attribute, reviseDocument }) => {
  if (mode != 'edit') return(
    <div className='attribute'>
      { value && <MagmaLink link={value} model={ template.name } /> }
    </div>
  );

  return <div className='attribute'>
    <SlowTextInput
    className='full_text'
    placeholder={ attribute.placeholder }
    onChange={ value => { reviseDocument( document, template, attribute, value) } }
    defaultValue={ revised_value } />
  </div>;
}

export default connect(
  null,
  { reviseDocument }
)(IdentifierAttribute);
