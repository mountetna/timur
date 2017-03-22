import React, { Component } from 'react'
import { connect } from 'react-redux'
import ManifestTitle from './title'
import { submitManifest } from '../../actions/manifest_editor_actions'

const Titlebar = ({ submitManifest }) => (
  <div className='title-bar-container' >
    <ManifestTitle />
    <div className='actions-container'>
      <div onClick={submitManifest}>
        Submit
        <i className="fa fa-paper-plane" aria-hidden="true"></i>
      </div>
    </div>
  </div>
)

export default connect(
  null, 
  { submitManifest }
)(Titlebar)