import React from 'react';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.renderDatalistOptions = this.renderDatalistOptions.bind(this);
  }

  renderDatalistOptions(term, i) {
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

  render() {
    let {
      inputChange, 
      input_value, 
      input_class_name, 
      search_bar_index, 
      input_options
    } = this.props;

    let input_props = {
      key: search_bar_index, 
      className: input_class_name,
      value: input_value, 
      onChange: inputChange,
      type: 'text'
    }
 
    return(
      <div className='search-bar-group'>

        <input {...input_props} />
        {
          input_options.length ? 
          <div className='option-items' key={input_value} id={input_value}>
            {input_options.map(this.renderDatalistOptions)}
          </div> : ''
        }
      </div>
    );
  }
}