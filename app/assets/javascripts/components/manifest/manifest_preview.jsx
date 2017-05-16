import React, { Component } from 'react'
import Dates from '../../dates'
import HideableText from './hideable_text'

const ManifestPreview = ({ name, project, updated_at, description, is_editable, user, access, handleClick }) => (
  <div className='manifest-preview'>
    <div>
      <a href='#' onClick={handleClick}>
        <span className='name'>{name}</span> {access}
      </a>
    </div>
  </div>
)

export default ManifestPreview
