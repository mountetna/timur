import React from 'react'
import { connect } from 'react-redux'
import Titlebar from './title_bar'
import ManifestElements from './manifest_elements'
import JSONViewer from 'react-json-viewer'
import Manifest from './manifest'

const Editor = ({manifest}) => (
  <div>
    <div className='manifest-container' >
      <Titlebar />
      <ManifestElements />
    </div>
    { manifest && <Manifest {...manifest} /> }
  </div>
)

const mapStateToProps = (state) => {
  const manifest = state.timur.manifests[state.manifestEditor.title]
  return { 
    manifest
  }
}

export default connect(mapStateToProps)(Editor)