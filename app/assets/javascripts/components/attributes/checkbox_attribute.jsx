// Framework libraries.
import * as React from 'react';

import * as MagmaActions from '../../actions/magma_actions';

export default class CheckboxAttribute extends React.Component{
  renderEdit(){
    let store = this.context.store;
    let self = this;
    let input_props = {
      type:"checkbox",
      className:"text_box",
      onChange:function(e) {
         store.dispatch(
           MagmaActions.reviseDocument(
             self.props.document,
             self.props.template,
             self.props.attribute,
             e.target.checked ? true : false
           )
         )
       },
      defaultChecked: this.props.revision
    };

    return(
      <div className="value">
        <input {...input_props} />
      </div>
    );
  }

  render(){
    let self = this;
    let store = this.context.store;

    if (this.props.mode == "edit") return this.renderEdit();
    return <div className="value"> { this.props.value ? "yes" : "no" } </div>
  }
}
