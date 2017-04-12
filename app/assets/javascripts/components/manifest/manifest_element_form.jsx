import React from 'react'
import InputField from './input_field'
import TextField from './text_field'

const ManifestElementForm = ({ element, updateAttribute, handleRemove }) => (
  <div>
    <button onClick={handleRemove}>remove</button>
    <InputField type="text"
                placeholder='e.g. mfi'
                label='element name'
                onChange={updateAttribute('name')}/>
    <TextField label='description'
               onChange={updateAttribute('description')} />
    <TextField label='script'
               onChange={updateAttribute('script')} />
  </div>
)

export default ManifestElementForm