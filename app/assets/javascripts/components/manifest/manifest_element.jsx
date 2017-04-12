import React from 'react'

const ManifestElement = ({ name, script, description}) => (
  <div className="element">
    <div>name:</div>
    <div>{name}</div>
    <div>description:</div>
    <div>{description}</div>
    <div>script:</div>
    <div>{script}</div>
  </div>
)

export default ManifestElement