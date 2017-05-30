import React from 'react'

const RadioSelector = ({options, selected, handleSelect, label}) => {
  const radios = options.map(option => (
    <span key={option}> 
      <input type='radio'
        onChange={() => handleSelect(option)} 
        checked={selected === option} />
      {option}
    </span>
  ))

  return (
    <div className='selector input-container'>
      <label>{label}</label>
      {radios}
    </div>
  )
}

export default RadioSelector
