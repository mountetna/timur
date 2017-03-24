import React from 'react'
import { connect } from 'react-redux'
import Titlebar from './title_bar'
import ManifestElements from './manifest_elements'
import JSONViewer from 'react-json-viewer'

const Editor = ({manifest}) => (
  <div className='manifest-container' >
    <Titlebar />
    <ManifestElements />
    <JSONViewer json={manifest} />
  </div>
)

const mapStateToProps = (state) => {
  const manifest = state.timur.manifests[state.manifestEditor.title]
  return { 
    manifest
  }
}

export default connect(mapStateToProps)(Editor)