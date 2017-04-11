import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectManifest } from '../../actions/manifest_actions'
import NewManifestForm from './new_manifest_form'

class Manifest extends Component {

  isNewManifest() {
    return this.props.manifestId === 'new'
  }

  render () {
    return (
      <div className='manifest-container'>
        { this.isNewManifest() ? 
          <NewManifestForm canEditAccess={true} /> :
          <a href="#" onClick={this.props.allManifests}>all manifests</a>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const manifest = state.manifests[ownProps.manifestId]
  return ({
    manifest
  })
}

export default connect(mapStateToProps)(Manifest)
