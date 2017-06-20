import React from 'react'
import Script from './script'
import HideableText from "./hideable_text"
import { Result } from "./manifest_results"

// A single element (variable/expression pair) from a manifest
const ManifestElement = ({ name, script, description, result, view_mode }) => (
  <div className="element">
    <div className='name'>@{name}</div>
    <div className='equals'>=</div>
    {
      view_mode == 'script' ? Script(script) : Result(name,result)
    }
  </div>
)

export default ManifestElement
