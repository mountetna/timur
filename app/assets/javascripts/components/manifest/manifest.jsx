import React, { Component } from 'react'
import ManifestForm from './manifest_form'
import ManifestView from './manifest_view'
import ManifestResults from './manifest_results'

class Manifest extends Component {
  componentWillMount() {
    const { manifest } = this.props

    if (!manifest || !manifest.result) {
      this.setState({ result: {} })
    }

    if (manifest) {
      this.setState({ name: manifest.name })

      if (manifest.result) {
        this.setState({
          result: manifest.result
        })
      } else {
        this.props.submitManifest(manifest)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.manifest && nextProps.manifest.result) {
      this.setState({
        result: nextProps.manifest.result
      })
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
            submitManifest={this.props.submitManifest}/> :
          <div>
            <a href="#" onClick={this.props.allManifests}>
              all manifests
            </a>
            <ManifestView
              manifest={this.props.manifest}
              handleDelete={this.props.delete}
              handleEdit={this.props.edit}
              handleCopy={()=>{ this.props.copy(this.props.manifest)}} />
          </div>
        }
        <ManifestResults results={this.state.result} />
      </div>
    )
  }
}

export default Manifest