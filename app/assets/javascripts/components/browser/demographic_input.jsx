import React from 'react';

export default class DemographicInput extends React.Component{
  render(){

    let {
      input_type,
      input_key,
      input_value,
      select_options,
      inputChange
    } = this.props;

    let input_props = {
      className: 'demographic-input',
      value: input_value,
      onChange: inputChange
    };

    switch(input_type){
      case 'string':
        input_props['key'] = `string-${input_key}`;
        input_props['type'] = 'text';
        return <input {...input_props} />;
      case 'number':
        input_props['key'] = `number-${input_key}`;
        input_props['type'] = 'number';
        return <input {...input_props} />;
      case 'date':
        input_props['key'] = `date-${input_key}`;
        input_props['type'] = 'date';
        return <input {...input_props} />;
      case 'regex':
        input_props['key'] = `regex-${input_key}`;
        input_props['className'] = 'demographic-select';
        return(
          <select {...input_props}>

            <option defaultValue=''>{'Make Selection'}</option>
            {select_options}
          </select>
        );
      default:
        return <div>{'Input Type Error'}</div>;
    }
  }
}
