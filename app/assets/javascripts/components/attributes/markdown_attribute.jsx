// Framework libraries.
import * as React from 'react';

// Module imports.
import * as MagmaActions from '../../actions/magma_actions';
import markdown from '../../markdown';

export default class MarkdownAttribute extends React.Component{
  renderEdit(){
    let store = this.context.store;
    let self = this;
    let textarea_props = {
      className: 'text_box',
      onChange: function(e){
        store.dispatch(
          MagmaActions.reviseDocument(
            self.props.document,
            self.props.template,
            self.props.attribute,
            e.target.value
          )
        );
      },
      defaultValue: this.props.revision
    };

    return(
      <div className='value'>

        <textarea {...textarea_props} />
      </div>
    );
  }

  render(){
    let store = this.context.store;
    let self = this;
    if(this.props.mode == 'edit') return renderEdit();
    if(!this.props.value) return <div className='value' />

    let content = markdown(this.props.value)
    return <div className='value' dangerouslySetInnerHTML={{__html: content}} />
  }
}
