// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';
import SlowTextInput from '../inputs/slow_text_input';

export default class Attribute extends React.Component{
  renderEdit(){
    let {document, template, attribute, revision, reviseDocument} = this.props;
    let input_props = {
      className: 'full_text',
      placeholder: attribute.placeholder,
      onChange: (value)=>{
        reviseDocument({
          document,
          template,
          attribute, 
          revised_value: value
        });
      },
      defaultValue: (revision == null) ? '' : revision
    };

    return <SlowTextInput {...input_props} />;
  }

  render(){
    return(
      <div className='value'>

        {(this.props.mode == 'edit') ? this.renderEdit() : this.props.value}
      </div>
    );
  }
}

const mapStateToProps = (dispatch, own_props)=>{
  return {};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    reviseDocument: (args)=>{
      dispatch(MagmaActions.reviseDocument(args));
    }
  };
};

export const AttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Attribute);
