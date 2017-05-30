import React from 'react'

const InputField = ({ type, placeholder, label, onChange, value }) => {
  const id = label.split(' ').join('_') + '_' + type

  return (
    <div className='input-container'>
      <div style={{display: 'inline'}}>
        <label htmlFor={id}>{label}</label>
      </div>
      <div className='input'>
        <input id={id} type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  )
}

export default InputField
