
// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';
import SlowTextInput from '../inputs/slow_text_input';
import MagmaLink from '../magma_link';

export default class LinkAttribute extends React.Component{
  renderEdit(){

    let self = this;
    let store = this.context.store;
    let link = this.props.revision;
    let link_props = {
      className:'delete_link',
      onClick:function(e) {
        store.dispatch(MagmaActions.reviseDocument(
          self.props.document,
          self.props.template,
          self.props.attribute,
          null))
      }
    }

    if(link && link == this.props.value){
      return(
        <div className='value'>

          <span {...link_props}>{link}</span>
        </div>
      );
    }

    let input_props = {
      className:'link_text',
      waitTime:500,
      onChange: (value)=>{
        store.dispatch(MagmaActions.reviseDocument(
          self.props.document,
          self.props.template,
          self.props.attribute,
          value)
        )
      },
      placeholder:'New or existing ID'
    }

    return(
      <div className='value'>

        <SlowTextInput />
      </div>
    );
  }

  render(){
    let link = this.props.value;
    let self = this;
    let store = this.context.store;
    
    if (this.props.mode == 'edit') return renderEdit();

    if(link){
      return(
        <div className='value'>
          <MagmaLink link={link} model={ this.props.attribute.model_name } />
        </div>
      );
    }

    return <div className='value'/>;
  }
}
