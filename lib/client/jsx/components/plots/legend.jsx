import React, {Component} from 'react';

const Legend = ({labels, width}) =>
  <div className='legend-container' style={ { width } } >
    {
      labels.flat().map(({name,color}) =>
        <div key={ name } className='category-group'>
          <div className='label-rect' style={{background: color}}/>
          <div className='label-text'>{name}</div>
        </div>
      )
    }
  </div>;

export default Legend;
