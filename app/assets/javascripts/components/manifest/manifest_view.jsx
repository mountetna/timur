import React from 'react'
import ManifestElement from './manifest_element'

const ManifestView = ({ manifest, handleDelete, handleEdit, handleCopy }) => {
  const {name, project, updated_at, description, is_editable, user, access} = manifest
  const elements =  manifest.data.elements || []
  const manifestElements = elements.map((element, i) => (
    <li key={i}>
      <ManifestElement {...element}/>
    </li>
  ))

  return (
    <div className='manifest'>
      { is_editable && <button onClick={handleDelete}>delete</button> }
      { is_editable && <button onClick={handleEdit}>edit</button> }
      <button onClick={handleCopy}>copy</button>
      <div className='name'>{name}</div>
      <div className='project'>{project}</div>
      <div className='access'>{access}</div>
      <div className='created-by'> created by: {user.name}</div>
      <div className='updated-time'>last updated: {updated_at}</div>
      <div>description:</div>
      <div className='description'>{description}</div>
      <div>Manifest</div>
      <ol>
        {manifestElements}
      </ol>
    </div>
  )
}

export default ManifestView