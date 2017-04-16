import React from 'react'
import ManifestElement from './manifest_element'
import ManifestPreview from './manifest_preview'

const ManifestView = ({ manifest, handleDelete, handleEdit, handleCopy, back}) => {
  const { is_editable, result, name } = manifest

  const elements =  manifest.data.elements || []
  const manifestElements = elements.map((element, i) => {
    let elementResult
    if (result) {
      if (result[name] && result[name][element.name]) {
        elementResult = result[manifest.name][element.name]
      } else {
        elementResult = result
      }
    } else {
      elementResult = ''
    }
    const props = { ...element, result: elementResult }
    return (
      <li key={i}>
        <ManifestElement {...props}/>
      </li>
    )
  })

  return (
    <div className='manifest'>
      <ManifestPreview {...manifest} />
      <div className='manifest-elements'>
        <div className='actions'>
          <button onClick={back}>
            <i className='fa fa-angle-left' aria-hidden="true"></i>
            back
          </button>
          { is_editable &&
            <button onClick={handleDelete}>
              <i className='fa fa-trash-o' aria-hidden="true"></i>
              delete
            </button>
          }
          { is_editable &&
            <button onClick={handleEdit}>
              <i className='fa fa-pencil-square-o' aria-hidden="true"></i>
              edit
            </button>
          }
          <button onClick={handleCopy}>
            <i className='fa fa-files-o' aria-hidden="true"></i>
            copy
          </button>
        </div>
        <ol>
          {manifestElements}
        </ol>
      </div>
    </div>
  )
}

export default ManifestView