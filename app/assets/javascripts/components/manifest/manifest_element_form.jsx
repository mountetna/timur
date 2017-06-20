import React from 'react'
import InputField from './input_field'
import TextField from './text_field'
import { Result } from './manifest_results'

// Edit component for a single variable/expression from a manifest
const ManifestElementForm = ({ element, updateAttribute, handleRemove, result}) => (
  <div className='element-form'>
    <i className='fa fa-times-circle remove' onClick={handleRemove}/>
    <InputField type="text"
      placeholder='variable name'
      label='@'
      onChange={updateAttribute('name')}
      value={element.name} />
    <span className='equals'>=</span>
    <div className='script'>
      <textarea
        onChange={(e) => updateAttribute('script')(e.target.value)}
        value={element.script} />
    </div>
    {Result('',result)}
  </div>
)

export default ManifestElementForm
