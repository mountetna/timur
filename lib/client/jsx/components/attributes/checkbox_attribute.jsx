// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';

const CheckboxAttribute = ({ mode, value, revised_value,
  document, template, attribute, reviseDocument }) => {
  if (mode != 'edit') return <div className='attribute'> { value ? 'yes' : 'no' } </div>;

  return(
    <div className='attribute'>
      <input type='checkbox'
        className='text_box'
        onChange={ e => reviseDocument(document, template, attribute, !!e.target.checked) }
        defaultChecked={ revised_value } />
    </div>
  );
}

export default connect(
  null,
  { reviseDocument }
)(CheckboxAttribute);
