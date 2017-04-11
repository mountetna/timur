import React, { Component } from 'react'
import NewManifestForm from './new_manifest_form'

class Manifest extends Component {
  isNewManifest() {
    return this.props.manifestId === 'new'
  }

  render () {
    return (
      <div className='manifest-container'>
        { this.isNewManifest() ? 
          <NewManifestForm 
            //TODO add userRole
            canEditAccess={true} 
            cancel={this.props.allManifests}
            save={this.props.saveNewManifest} /> :
          <a href="#" onClick={this.props.allManifests}>
            all manifests
          </a>
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

export default Manifest