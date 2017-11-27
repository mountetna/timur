import React from 'react';

const CheckBoxes = ({selected, options, onChange}) => (
  <span>
    {options.map(option => (
      <span key={option} className='checkbox'>
        <input id={option} type='checkbox' value={option}
               checked={option === selected}
               onChange={() => onChange(option)} />
        <label htmlFor={option}>{option}</label>
      </span>
    ))}
  </span>
);

export default CheckBoxes;