import React from 'react'

const ManifestFilters = ({ accessFilters, selectedFilter, handleSelect }) => {
  const options = accessFilters.map(filter => (
    <span> 
      <input type='radio'
        onChange={() => handleSelect(filter)} 
        checked={selectedFilter === filter} />
      private
    </span>
  ))

  return (
    <div className='filters'>
      Filter:
      {options}
    </div>
  )
}

export default ManifestFilters