import React, { Component } from 'react'
import Dates from '../../dates'
import HideableText from './hideable_text'

const ManifestInfo = (name, info) =>
  <div className="manifest-info">
    <span className='label'>{name}</span>
    <span className='value'>{info}</span>
  </div>

const ManifestPreview = ({ name, project, updated_at, description, is_editable, user, access, handleClick }) => (
  <div className='manifest-preview'>
    <div>
      <span className='name'>{name}</span>
      {ManifestInfo('Author',user.name)}
      {ManifestInfo('Access',access)}
      {ManifestInfo('Last updated',
        Dates.format_date(updated_at) + ', '+ Dates.format_time(updated_at)
      )}
      <span className='description'>{description}</span>
    </div>
  </div>
)

export default ManifestPreview
