import React, { Component } from 'react'
import ManifestForm from './manifest_form'
import ManifestView from './manifest_view'

class Manifest extends Component {
  componentWillMount() {
    const { manifest } = this.props

    if (!manifest || !manifest.result) {
      this.setState({ result: {} })
    }

    if (manifest) {
      if (manifest.result) {
        this.setState({
          result: manifest.result
        })
      } else {
        this.props.submitManifest(manifest)
      }
    }
  }

  render () {
    return (
      <div className='manifest-container'>
        { this.props.editing ?
          <ManifestForm
            isAdmin={this.props.isAdmin}
            manifest={this.props.manifest}
            canEditAccess={true} 
            cancel={this.props.edit}
            create={this.props.saveNewManifest}
            update={this.props.updateManifest}
            updateResults={this.props.fetchResults} /> :
          <ManifestView
            manifest={this.props.manifest}
            handleDelete={this.props.delete}
            handleEdit={this.props.edit}
            handleCopy={()=>{ this.props.copy(this.props.manifest)}} />
        }
      </div>
    )
  }
}

export default Manifest
