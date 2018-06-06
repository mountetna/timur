// Framework libraries.
import * as React from 'react';

export default class ClinicalInput extends React.Component{
  constructor(props){
    super(props);
  }

  renderSearch(input_props, name, choices){
    let default_option = null;
    if(name == null || input_props['value'] == ''){
      input_props['value'] = '';
      default_option = (
        <option value='' disabled selected>

          {'Select...'}
        </option>
      );
    }

    let options = choices.map((choice)=>{
      let random = Math.random().toString(16).slice(2, -1);
      let option_props = {
         key: `${choice.name}_${random}`,
         value: choice.value,
         'data-option_uid': choice.uid
      };

      return <option {...option_props}>{choice.label}</option>;
    });

    let random_uid = Math.random().toString(16).slice(2, -1);
    input_props['list'] = `list-${random_uid}`;
    input_props['className'] = 'search-dropdown-input';
    return(
      <div className='search-dropdown-group'>

        <input {...input_props} />
        <datalist id={`list-${random_uid}`}>

          {default_option}
          {options}
        </datalist>
      </div>
    );
  }

  renderMulti(input_props, name, choices){

    let default_option = null;
    if(name == null || input_props['value'] == ''){
      input_props['value'] = '';
      default_option = (
        <option value='' disabled selected>

          {'Select...'}
        </option>
      );
    }

    let options = choices.map((choice)=>{
      let random = Math.random().toString(16).slice(2, -1);
      let option_props = {
         key: `${choice.name}_${random}`,
         value: choice.value,
         'data-option_uid': choice.uid
      };

      return <option {...option_props}>{choice.label}</option>;
    });

    input_props['className'] = 'clinical-record-selector';
    return(
      <select {...input_props}>

        {default_option}
        {options}
      </select>
    );
  }

  render(){
    let {uid, name, type, value, values, editing, onChange} = this.props;

    let input_props = {
      value: (value == null) ? '' : value,
      disabled: !editing,
      className: 'clinical-record-input',
      key: `input_${type}_${uid}`,
      'data-uid': uid,
      'data-name': name,
      onChange: onChange
    };

    switch(type){
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
        input_props['className'] = 'clinical-record-date';
        return <input {...input_props} />;

      case 'regex':
      case 'dropdown':
      case 'select':
      case 'boolean':
      case 'key':
        if(values == null) return null;
        if(Object.keys(values).length <= 0) return null;
        if(Object.keys(values).length > 3 && type != 'key'){
          return this.renderSearch(input_props, name, values);
        }
        else{
          return this.renderMulti(input_props, name, values);
        }

      default:
        return null;
    }
  }
}
