import React from 'react';

export default class DemographicInput extends React.Component{
  constructor(props) {
    super(props);

    this.renderSearchOptions = this.renderSearchOptions.bind(this);
  }

  renderSearchOptions(term, i) {
    let option_props = {
      className: 'item-container', 
      key: term + i, 
      'data-term': term,
      onClick: this.props.onSelectionChange
    }

    let icon_props = {
      key: `${term + i}info`,
      'data-term': term || '',
      className: 'fa fa-info-circle',
      'aria-hidden': 'true',
      onMouseEnter: this.props.infoTipShow,
      onMouseLeave: this.props.infoTipHide,
    }

    return (
      <div {...option_props}>

        {term} 
        {this.props.infoTipShow  && <i {...icon_props}></i>}
      </div>
    );
  }

  render(){

    let {
      input_type,
      input_key,
      input_value,
      select_options,
      inputChange,
      selection_label,
      input_class_name,
      search_options,
      input_placeholder 
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
        input_props['type'] = 'date';
        return <input {...input_props} />;
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
        input_props['key'] = `search-${input_key}`;
        input_props['className'] = 'search-bar-group';
        input_props['placeholder'] = input_placeholder
        return(
          <div className='search-bar-group'>

            <input {...input_props} />
            {
              search_options.length ? 
              <div className='option-items' key={input_value} id={input_value}>
                {search_options.map(this.renderSearchOptions)}
              </div> : ''
            }
          </div>
        )
      default:
        return <div>{'Input Type Error'}</div>;
    }
  }
}
