import React from 'react'
import Script from './script'
import HideableText from "./hideable_text"
import { Result } from "./manifest_results"

const ManifestElement = ({ name, script, description, result, view_mode }) => (
  <div className="element">
    <div className='name'>@{name}</div>
    <div className='equals'>=</div>
    {
      view_mode == 'script' ? Script(script) : Result('',result)
    }
  </div>
)

export default ManifestElement
