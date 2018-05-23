// Framework libraries.
import * as React from 'react';

// Class imports.
import DropdownSearch from '../general/dropdown_search';

export default class ClinicalInput extends React.Component{
  constructor(props){
    super(props);
  }

  render(){

    let {record} = this.props;
    let input_props = {
      value: record.value,
      className: 'clinical-record-input',
      key: `input_${record.type}_${record.id}`,
      onChange: (event)=>{
        console.log(event);
      }
    };

    switch(record.type){
      case 'string':
        input_props['type'] = 'text';
        return <input {...input_props} />;
      case 'textarea':
        input_props['type'] = 'textarea';
        return <input {...input_props} />;
      case 'number':
        input_props['type'] = 'number';
        return <input {...input_props} />;
      case 'date':
        input_props['type'] = 'date';
        input_props['className'] = ' clinical-record-date';
        return <input {...input_props} />;
      case 'regex':
      case 'dropdown':
      case 'select':
      case 'boolean':
        if(record.definitions == undefined) return null;
        if(record.definitions.values == undefined) return null;
        input_props['className'] = ' clinical-record-selector';
        return(
          <select {...input_props}>

            {record.definitions.values.map((val)=>{
              return(
                <option key={Math.random()} value={val}>

                  {val}
                </option>
              );
            })}
          </select>
        );
      case 'checkbox':
        if(record.definitions == undefined) return null;
        if(record.definitions.values == undefined) return null;
        if(record.values == undefined) return null;

        input_props['className'] = 'clinical-record-checkbox';
        return(
          <fieldset {...input_props}>
            {record.definitions.values.map((val)=>{

              if(record.values.indexOf(val) > -1){
                console.log('sup');
              }

              let check_props = {
                type: 'checkbox',
                value: val,
                checked: (record.values.indexOf(val) > -1) ? 'checked' : '',
                onChange: (event)=>{
                  console.log(event);
                }
              };

              return(
                <div className='clinical-record-checkbox-grouping'>

                  <input {...check_props} />
                  {val}
                </div>
              );
            })}
          </fieldset>
        );
    }

    return <div>{'sup'}</div>;
  }

/*
    let {
      input_type,
      input_key,
      input_value,
      select_options,
      selection_label,
      input_class_name,
      search_options,
      input_placeholder,
      inputChange,
    } = this.props;

    let input_props = {
      className: 'clinical-input',
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
        input_props['type'] = 'datetime-local';

        let timestamp = Date.parse(input_value);
        if(!isNaN(timestamp)){
          let dt = new Date(timestamp).toISOString().replace('Z', '');
          input_props['value'] = dt;
        }

        return <input {...input_props} />;
      case 'boolean':
      case 'regex':
      case 'select':
        input_props['key'] = `regex-${input_key}`;
        input_props['className'] = 'clinical-select';
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
        console.log('Input Type Error: '+ input_type);
        return null;
    }
  }
*/
}
