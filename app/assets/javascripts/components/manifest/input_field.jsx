import React from 'react'

const InputField = ({ type, placeholder, label, onChange, value }) => {
  const id = label.split(' ').join('_') + '_' + type

  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <input id={id} type={type}
        value={value}
        placeholder={placeholder} 
        onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export default InputField