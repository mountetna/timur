import React from 'react'

const TextField = ({ label, onChange, value }) => {
  const id = label.split(' ').join('_') + '_' + 'text'

  return (
    <div className='input-container'>
      <div>
        <label htmlFor={id}>{label}</label>
      </div>
      <div>
        <textarea id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}>
        </textarea>
      </div>
    </div>
  )
}

export default TextField
