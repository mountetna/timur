import React from 'react'
import CheckBoxes from './checkboxes'

const ManifestFilter = ({ handleChange, selected }) => (
  <div className='filter'>
    Filter:
    <CheckBoxes selected={selected}
      options={['public', 'private']}
      onChange={handleChange} />
  </div>
)

export default ManifestFilter