// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';
import SelectInput from '../inputs/select_input';

export default class SelectAttribute extends React.Component{
  renderEdit(){
    let store = this.context.store;
    let self = this;
    let input_props = {
      className:"selection",
      onChange: function(value) {
         store.dispatch(MagmaActions.reviseDocument(
           self.props.document,
           self.props.template,
           self.props.attribute,
           value)
         )
       },
      defaultValue: this.props.value,
      showNone:"disabled",
      values: this.props.attribute.options
    }

    return(
      <div className="value">

        <SelectInput {...input_props} />
      </div>
    )
  }

  render(){
    let self = this;
    let store = this.context.store;
    if (this.props.mode == "edit") return this.renderEdit();
    return <div className="value">{ this.props.value }</div>;
  }
}
