// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import * as MagmaActions from '../../actions/magma_actions';
import {IntegerInput} from '../inputs/numeric_input';

export default class IntegerAttribute extends React.Component{
  renderInput(){
    let {revision, attribute, NumericInput, reviseDocument} = this.props;
    let input_props = {
      className: 'full_text',
      placeholder: attribute.placeholder,
      defaultValue: revision,
      onChange: (value)=>{
        reviseDocument({
          document,
          template,
          attribute,
          revised_value: value
        });
      }
    };

    return <IntegerInput {...input_props} />;
  }

  render(){
    return(
      <div className='value'>

        {this.props.mode == 'edit' ? this.renderInput() : this.props.value}
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

export const IntegerAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(IntegerAttribute);
