import React from 'react'
import InputField from './input_field'
import TextField from './text_field'

const ManifestElementForm = ({ element, updateAttribute, handleRemove }) => (
  <div>
    <button onClick={handleRemove}>remove</button>
    <InputField type="text"
      placeholder='e.g. mfi'
      label='element name'
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