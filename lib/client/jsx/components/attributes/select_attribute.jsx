// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import Dropdown from '../inputs/dropdown';

class SelectAttribute extends React.Component{
  revise(value) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document,
      template,
      attribute,
      value
    )
  }

  render(){
    let { attribute, mode, value, revision } = this.props;

    if (mode != 'edit') return <div className="value">{ value }</div>;

    let { options } = attribute;

    let selected = options.indexOf(revision);

    return(
      <div className="value">
        <Dropdown
          default_text='Select option'
          list={options}
          onSelect={index => {
            this.revise(options[index])
          }}
          selected_index={selected}
        />
      </div>
    )
  }
}

export default connect(
  null,
  { reviseDocument }
)(SelectAttribute);
