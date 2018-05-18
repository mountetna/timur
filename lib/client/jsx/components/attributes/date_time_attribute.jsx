// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MagmaActions from '../../actions/magma_actions';
import * as DateUtils from '../../utils/dates';
import DateTimeInput from '../inputs/date_time_input';

export default class DateTimeAttribute extends React.Component{
  renderEdit(){
    let {document, template, attribute, reviseDocument} = this.props;
    let input_props = {
      defaultValue: this.props.revision,
      onChange: (new_date)=>{
        reviseDocument({
          document,
          template,
          attribute,
          revised_value: new_date && new_date.toISOString()
        });
      }
    };

    return <DateTimeInput {...input_props} />;
  }

  renderValue(value){
    return <div className='value'>{DateUtils.formatDate(value)}</div>;
  }

  render(){
    let {value, mode} = this.props;
    return(
      <div className='value'>

        {(mode == 'edit') ? this.renderEdit() : this.renderValue(value)}
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

export const DateTimeAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(DateTimeAttribute);
