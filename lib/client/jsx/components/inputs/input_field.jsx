import React from 'react';

const InputField = ({ type, placeholder, label, onChange, value, checked, onKeyPress }) => {
  const id = label.split(' ').join('_') + '_' + type;

  return (
    <div className='input-container'>
      <div style={{display: 'inline'}}>
        <label htmlFor={id}>{label}</label>
      </div>
      <div className='input'>
        <input id={id} type={type}
          onkeypress={onKeyPress}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          checked={checked}
        />
      </div>
    </div>
  )
};

export default InputField;
