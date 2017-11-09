import React from 'react'
import CheckBoxes from '../inputs/checkboxes'

const ManifestFilter = ({ handleChange, selected }) => (
  <div className='filter'>
    Filter:
    <CheckBoxes selected={selected}
      options={['public', 'private']}
      onChange={handleChange} />
  </div>
)

export default ManifestFilter