// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import { reviseDocument } from '../../actions/magma_actions';

class CheckboxAttribute extends React.Component{
  revise(e) {
    let { document, template, attribute, reviseDocument } = this.props;

    reviseDocument(
      document,
      template,
      attribute,
      e.target.checked ? true : false
    );
  }

  renderEdit(){
    let { revision } = this.props;
    let input_props = {
      type:"checkbox",
      className:"text_box",
      onChange: this.revise.bind(this),
      defaultChecked: revision
    };

    return(
      <div className="value">
        <input {...input_props} />
      </div>
    );
  }

  render(){
    let { mode, value } = this.props;
    if (mode == "edit") return this.renderEdit();
    return <div className="value"> { value ? "yes" : "no" } </div>
  }
}

export default connect(
  null,
  { reviseDocument }
)(CheckboxAttribute);
