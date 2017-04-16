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
            //TODO add userRole
            manifest={this.props.manifest}
            canEditAccess={true} 
            cancel={this.props.edit}
            create={this.props.saveNewManifest}
            update={this.props.updateManifest}
            updateResults={this.props.fetchResults} /> :
          <div>
            <a className='back' href="#" onClick={this.props.allManifests}>
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
              back to manifests
            </a>
            <ManifestView
              manifest={this.props.manifest}
              handleDelete={this.props.delete}
              handleEdit={this.props.edit}
              handleCopy={()=>{ this.props.copy(this.props.manifest)}} />
          </div>
        }
      </div>
    )
  }
}

export default Manifest