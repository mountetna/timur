import React, { Component } from 'react'
import ManifestForm from './manifest_form'
import ManifestView from './manifest_view'

class Manifest extends Component {
  isNewManifest() {
    return this.props.manifestId === 'new'
  }

  render () {
    return (
      <div className='manifest-container'>
        { this.isNewManifest() ? 
          <ManifestForm
            //TODO add userRole
            canEditAccess={true} 
            cancel={this.props.allManifests}
            save={this.props.saveNewManifest} /> :
          <div>
            <a href="#" onClick={this.props.allManifests}>
              all manifests
            </a>
            <ManifestView
              manifest={this.props.manifest}
              handleEdit={()=>{}}
              handleCopy={()=>{}} />
          </div>
        }
      </div>
    )
  }
}

export default Manifest