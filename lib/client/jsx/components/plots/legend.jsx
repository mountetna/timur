import React, {Component} from 'react';

export default class Legend extends Component{
  render(){
    let {labels} = this.props;
    let categories = [];

    for(let item in labels){

      let legend_category_props = {
        key: labels[item].color,
        className: 'category-group',
      };

      let color_props = {
        className: 'label-rect',
        style: {background: labels[item].color}
      };

      categories.push(
        <div {...legend_category_props}>
          <div {...color_props}></div>
          <div className='label-text'>{labels[item].text}</div>
        </div>
      );
    }

    return(
        <div className='legend-container'>
          {categories}
        </div>
    );
  }
}

