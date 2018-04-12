// Framework libraries.
import * as React from 'react';

// Class imports.
import DropdownSearch from '../../generic/dropdown_search';

export default class ClinicalInput extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    let {
      input_type,
      input_key,
      input_value,
      select_options,
      selection_label,
      extend_class_name,
      search_options,
      input_placeholder,
      inputChange,
      input_disabled
    } = this.props;

    let input_props = {
      className: `clinical-input ${extend_class_name}`,
      value: input_value,
      onChange: inputChange,
      disabled: input_disabled
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
        input_props['type'] = 'datetime-local';

        let timestamp = Date.parse(input_value);
        if(!isNaN(timestamp)){
          let dt = new Date(timestamp).toISOString().replace('Z', '');
          input_props['value'] = dt;
        }

        return <input {...input_props} />;
      case 'regex':
      case 'select':
        input_props['key'] = `regex-${input_key}`;
        input_props['className'] = `clinical-select ${extend_class_name}` ;
        return(
          <select {...input_props}>

            <option defaultValue=''>
            
              {`Make ${selection_label || ''} Selection`}
            </option>
            {select_options}
          </select>
        );
      case 'search':
        return <DropdownSearch {...this.props} />;
      default:
        return <div>{'Input Type Error'}</div>;
    }
  }
}
