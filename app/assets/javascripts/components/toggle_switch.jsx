import React, { Component } from 'react'

export default class ToggleSwitch extends Component {
  render() {
    let { values: [ left, right ], id, caption, selected, onChange } = this.props
    return <div className="toggle-switch">
      <span className='caption'>{caption}</span>
      <div className="switchbox">
        <input type="checkbox" name="toggle-switch"
          id={id}
          onChange={ (e) => onChange(e.target.checked ? left : right) }
          checked={ selected == left }/>
        <label className="label" htmlFor={id}>
          <span className="left">{left}</span>
          <span className="right">{right}</span>
          <span className="switch"></span>
        </label>
      </div>
    </div>
  }
}


