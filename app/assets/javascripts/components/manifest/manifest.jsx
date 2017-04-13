import React, { Component } from 'react'
import ManifestForm from './manifest_form'
import ManifestView from './manifest_view'

class Manifest extends Component {
  render () {
    return (
      <div className='manifest-container'>
        { this.props.editing ?
          <ManifestForm
            //TODO add userRole
            manifest={this.props.manifest}
            canEditAccess={true} 
            cancel={this.props.edit}
            create={this.props.saveNewManifest}
            update={this.props.updateManifest} /> :
          <div>
            <a href="#" onClick={this.props.allManifests}>
              all manifests
            </a>
            <ManifestView
              manifest={this.props.manifest}
              handleDelete={this.props.delete}
              handleEdit={this.props.edit}
              handleCopy={()=>{}} />
          </div>
        }
      </div>
    )
  }
}

export default Manifest