import React from 'react';

export default class DropdownSearch extends React.Component{
  constructor(props){
    super(props);
  }

  renderSearchOptions(term, index){
    let option_props = {
      className: 'item-container',
      key: term + index,
      'data-term': term,
      onClick: this.props.onSelectionChange
    }

    let icon_props = {
      key: `${term + index}info`,
      'data-term': term || '',
      className: 'fa fa-info-circle',
      'aria-hidden': 'true',
      onMouseEnter: this.props.infoTipShow,
      onMouseLeave: this.props.infoTipHide,
    }

    return(
      <div {...option_props}>

        {term}
        {this.props.infoTipShow  && <i {...icon_props}></i>}
      </div>
    );
  }

  render(){
    let {
      input_key,
      input_value,
      search_options,
      input_placeholder,
      inputChange
    } = this.props;

    let input_props = {
      className: 'search-bar-group',
      value: input_value,
      onChange: inputChange,
      key: `search-${input_key}`,
      placeholder: input_placeholder
    };

    return(
      <div className='search-bar-group'>

        <input {...input_props} />
        {
          search_options.length ?
          <div className='option-items' key={input_value} id={input_value}>

            {search_options.map(this.renderSearchOptions.bind(this))}
          </div> : ''
        }
      </div>
    );
  }
}

/*
  renderSearchOptions(term, index){
    let option_props = {
      className: 'item-container',
      key: term + index,
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

    return(
      <div {...option_props}>

        {term}
        {this.props.infoTipShow  && <i {...icon_props}></i>}
      </div>
    );
  }
*/
/*
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
*/