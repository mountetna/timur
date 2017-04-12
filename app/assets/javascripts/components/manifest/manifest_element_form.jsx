import React from 'react'

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