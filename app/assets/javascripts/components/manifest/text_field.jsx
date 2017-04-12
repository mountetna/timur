import React from 'react'

const TextField = ({ label, onChange, value }) => {
  const id = label.split(' ').join('_') + '_' + 'text'

  return (
    <div>
      <label htmlFor={id}>{label}:</label>
      <textarea id={id}
             value={value}
             onChange={(e) => onChange(e.target.value)}>
      </textarea>
    </div>
  )
}

export default TextField