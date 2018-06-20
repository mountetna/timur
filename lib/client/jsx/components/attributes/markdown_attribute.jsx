// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import * as MagmaActions from '../../actions/magma_actions';
import markdown from '../../utils/markdown';

export default class MarkdownAttribute extends React.Component{
  renderEdit(){
    let self = this;
    let textarea_props = {
      className: 'text_box',
      onChange: function(event){
        self.props.updateMarkdown(
          self.props.document,
          self.props.template,
          self.props.attribute,
          event.target.value
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
    if(this.props.mode == 'edit') return this.renderEdit();
    if(!this.props.value) return <div className='value' />

    let content = markdown(this.props.value);
    return <div className='value' dangerouslySetInnerHTML={{__html: content}}/>;
  }
}

const mapStateToProps = (dispatch, own_props)=>{
  return {};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    updateMarkdown: (doc, template, attribute, value)=>{
      dispatch(MagmaActions.reviseDocument(doc, template, attribute, value));
    }
  };
};

export const MarkdownAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(MarkdownAttribute);
