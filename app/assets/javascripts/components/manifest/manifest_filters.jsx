import React from 'react'

const ManifestFilters = ({ accessFilters = ['private', 'public'], selectedFilter, handleSelect, label='Filter:' }) => {
  const options = accessFilters.map(filter => (
    <span key={filter}> 
      <input type='radio'
        onChange={() => handleSelect(filter)} 
        checked={selectedFilter === filter} />
      {filter}
    </span>
  ))

  return (
    <div className='filters'>
      {label}
      {options}
    </div>
  )
}

export default ManifestFilters