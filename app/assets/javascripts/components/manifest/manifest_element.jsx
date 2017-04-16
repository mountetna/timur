import React from 'react'
import HideableText from "./hideable_text";
import { Result } from "./manifest_results"

const ManifestElement = ({ name, script, description, result}) => (
  <div className="element">
    <div className='name'>@{name}</div>
    <HideableText label='description' text={description} />
    <HideableText label='script' text={script} />
    {Result(name, result)}
  </div>
)

export default ManifestElement