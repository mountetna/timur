// Framework libraries.
import * as React from 'react';

// Class imports.
//import SearchDropdown from '../general/search_dropdown';

export default class ClinicalInput extends React.Component{
  constructor(props){
    super(props);
  }

  renderSearch(input_props){

    let random = Math.random().toString(16).slice(2, -1);

    input_props['type'] = 'text';
    input_props['list'] = random;
    input_props['className'] = 'search-dropdown-input';

    let button_style = {};
    let group_props = {className: 'search-dropdown-group'};
    if(!this.props.editing){
      group_props['className'] += ' search-dropdown-group-disabled';
      button_style = {display: 'none'};
    }

    let options = this.props.definitions.values.map((value)=>{
      return <option value={value} />;
    });

    return(
      <div {...group_props}>

        <button className='search-dropdown-btn' style={button_style}>

          <i class='fa fa-search'></i>
        </button>
        <input {...input_props} />
        <datalist id={random} className='search-dropdown-tray'>

          {options}
        </datalist>
      </div>
    );
  }

  renderMulti(input_props){
    let {value, definitions} = this.props;

    let default_option = null;
    if(value == null){
      input_props['value'] = '';
      default_option = (
        <option value='' disabled>

          {'Select...'}
        </option>
      );
    }

    let options = definitions.values.map((val)=>{
      return(
        <option key={Math.random()} value={val}>

          {val}
        </option>
      );
    });

    input_props['className'] = 'clinical-record-selector';
    return(
      <select {...input_props}>

        {default_option}
        {options}
      </select>
    );
  }

  renderKey(input_props){
    let {name, peers} = this.props;

    let default_option = null;
    if(name == null){
      input_props['value'] = '';
      default_option = (
        <option value='' disabled>

          {'Select...'}
        </option>
      );
    }

    let options = Object.keys(peers).map((name)=>{
      return(
        <option key={Math.random()} value={name}>

          {peers[name].label}
        </option>
      );
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
    let {
      id,
      name,
      type,
      value,
      values,
      peers,
      definitions,
      editing,
      onChange
    } = this.props;

    let input_props = {
      value,
      disabled: !editing,
      className: 'clinical-record-input',
      key: `input_${type}_${id}`,
      'data-id': id,
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
        if(definitions == undefined) return null;
        if(definitions.values == undefined) return null;
        if(definitions.values.length > 2){
          return this.renderSearch(input_props);
        }
        else{
          return this.renderMulti(input_props);
        }

      case 'checkbox':
        if(definitions.values == undefined) return null;

        input_props['className'] = 'clinical-record-checkbox';
        return (
          <fieldset {...input_props}>
            {definitions.values.map((def_val)=>{

              let check_props = {
                type: 'checkbox',
                value: def_val,
                defaultChecked: def_val == value ? true : false,
                onChange: (event)=>{
                  console.log(event);
                }
              };

              return(
                <div className='clinical-record-checkbox-grouping'>

                  <input {...check_props} />
                  {def_val}
                </div>
              );
            })}
          </fieldset>
        );

      case 'key':
        if(peers == null) return null;
        if(Object.keys(peers).length <= 0) return null;
        return this.renderKey(input_props);

      default:
        return null;
    }
  }
}
