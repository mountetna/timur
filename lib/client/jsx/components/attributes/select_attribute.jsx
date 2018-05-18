// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';
import SelectInput from '../inputs/select_input';

export default class SelectAttribute extends React.Component{
  renderEdit(){
    let {value, document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      className: 'selection',
      onChange: function(value){
        reviseDocument({
          document,
          template,
          attribute,
          revised_value: value
        });
      },
      defaultValue: value,
      showNone: 'disabled',
      values: attribute.options
    };

    return(
      <div className='value'>

        <SelectInput {...input_props} />
      </div>
    );
  }

  render(){
    if (this.props.mode == 'edit') return this.renderEdit();
    return <div className='value'>{this.props.value}</div>;
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

export const SelectAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectAttribute);
