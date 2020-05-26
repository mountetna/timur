
// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import SlowTextInput from '../inputs/slow_text_input';
import MagmaLink from '../magma_link';

const LinkAttribute = ({ mode, value, revised_value,
  document, template, attribute, reviseDocument }) => {
  if (mode != 'edit') return(
    <div className='attribute'>
      { value && <MagmaLink link={value} model={ attribute.link_model_name } /> }
    </div>
  );

  if (revised_value && revised_value == value) {
    return(
      <div className='attribute'>
        <span className='delete_link'
          onClick={ e => reviseDocument(document, template, attribute, null) }>
          {revised_value}
        </span>
      </div>
    );
  }

  return(
    <div className='attribute'>
      <SlowTextInput className='link_text'
        waitTime={500}
        onChange={ v => reviseDocument(document, template, attribute, v) }
        placeholder='New or existing ID' />
    </div>
  );
}

export default connect(
  null,
  { reviseDocument }
)(LinkAttribute);
