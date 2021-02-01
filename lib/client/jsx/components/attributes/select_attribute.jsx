// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import Dropdown from '../inputs/dropdown';

const SelectAttribute = ({ mode, value, revised_value,
  document, template, attribute, reviseDocument }) => {

  if (mode != 'edit') return <div className='attribute'>{ value }</div>;

  let { options } = attribute;

  return(
    <div className='attribute'>
      <Dropdown
        default_text='Select option'
        list={options}
        onSelect={
          i => reviseDocument(document, template, attribute, options[i])
        }
        selected_index={ options.indexOf(revised_value) }
      />
    </div>
  )
}

export default connect(
  null,
  { reviseDocument }
)(SelectAttribute);
