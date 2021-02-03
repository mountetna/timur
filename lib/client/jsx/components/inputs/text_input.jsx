import * as React from 'react';

const TextInput = ({header, placeholder, value, onChange}) =>
  <div className='ti-group'>
    <label className='ti-label'>{header}</label>
    <input
      className='ti-input'
      placeholder={ placeholder }
      onChange={(e) => onChange(e.target.value)}
      value={value || ''}
      type='text' />
  </div>;

export default TextInput;
