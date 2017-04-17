import React from 'react'
import InputField from './input_field'
import TextField from './text_field'
import { Result } from './manifest_results'

const ManifestElementForm = ({ element, updateAttribute, handleRemove, result}) => (
  <div className='element-form'>
    <i className='fa fa-times-circle remove' onClick={handleRemove}></i>
    {Result(element.name, result)}
    <InputField type="text"
      placeholder='e.g. mfi'
      label='name'
      onChange={updateAttribute('name')}
      value={element.name} />
    <TextField label='description'
      placeholder='e.g. cure cancer and science stuff'
      onChange={updateAttribute('description')}
      value={element.description} />
    <TextField label='script'
      onChange={updateAttribute('script')}
      value={element.script} />
  </div>
)

export default ManifestElementForm