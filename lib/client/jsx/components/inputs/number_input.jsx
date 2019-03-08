import * as React from 'react';

const NumberInput = ({header, value, onChange, unit}) =>
  <div className='ni-group'>
    <label className='ni-label'>{header}</label>
    <input
      className='ni-input'
      onChange={(e) => onChange(e.target.value)}
      value={value}
      type='number'
      min='0'/>
      <span className='ni-unit'>{unit}</span>
  </div>;

export default NumberInput;
