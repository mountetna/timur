// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';

export default class DocumentAttribute extends React.Component{
  renderEdit(){
    let store = this.context.store;
    let self = this;
    let input_props = {
      onChange: function(e) {
        store.dispatch(MagmaActions.reviseDocument(
          self.props.document,
          self.props.template,
          self.props.attribute,
          e.target.files[0]))
      },
      type:"file"
    };

    return(
      <div className="value">
        <input {...input_props}/>
      </div>
    )
  }

  render(){

    let self = this;
    let store = this.context.store
    let link = this.props.value

    if (this.props.mode == "edit") return renderEdit();

    if (link){
      return(
        <div className="value">
          <a href={ link.url } > { link.path } </a>
        </div>
      );
    }

    return(
      <div className="value">
        <div className="document_empty">
          No file.
        </div>
      </div>
    );
  }
}
