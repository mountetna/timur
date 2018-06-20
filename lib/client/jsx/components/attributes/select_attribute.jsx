// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';
import SelectInput from '../inputs/select_input';

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

  renderEdit(){
    let { attribute, value } = this.props;
    let input_props = {
      className:"selection",
      onChange: this.revise.bind(this),
      defaultValue: value,
      showNone:"disabled",
      values: attribute.options
    }

    return(
      <div className="value">

        <SelectInput {...input_props} />
      </div>
    )
  }

  render(){
    let { mode, value } = this.props;
    if (mode == "edit") return this.renderEdit();
    return <div className="value">{ value }</div>;
  }
}

export default connect(
  null,
  { reviseDocument }
)(SelectAttribute);
