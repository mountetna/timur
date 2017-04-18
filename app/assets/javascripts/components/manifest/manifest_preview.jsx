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
    <span className='project'>{project}</span>
    <span className='created-by'> - {user.name}</span>
    <div className='updated-time'>
      last updated: {Dates.format_date(updated_at) + ', '+ Dates.format_time(updated_at)}
    </div>
    <HideableText label='description' text={description} />
  </div>
)

export default ManifestPreview