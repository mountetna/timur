import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getManifests, saveNewManifest, deleteManifest, toggleEdit, saveManifest, copyManifest, submitManifest, fetchManifestResults } from '../../actions/manifest_actions'
import Manifest from './manifest'
import ManifestSelector from './manifest_selector'
import debounce from 'lodash.debounce'

class Manifests extends Component {
  componentDidMount() {
    this.props.getManifests()
  }

  render() {
    const { manifests, selectedManifest } = this.props

    return (
      <div className='manifests-container'>
        <ManifestSelector manifests={manifests}/>
        <div className='manifest-view'>
        { (selectedManifest || this.props.isEditing) ?
          <Manifest
            isAdmin={this.props.isAdmin}
            editing={this.props.isEditing}
            manifestId={selectedManifest}
            saveNewManifest={this.props.saveNewManifest}
            manifest={this.props.manifest}
            delete={() => this.props.deleteManifest(selectedManifest)}
            edit={this.props.toggleEdit}
            updateManifest={this.props.saveManifest}
            copy={this.props.copyManifest}
            submitManifest={this.props.submitManifest}
            fetchResults={this.props.fetchManifestResults}/>
            : null
        }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { manifests, manifestsUI: { selected, isEditing } } = state
  return {
    manifests: manifests,
    selectedManifest: selected,
    manifest: manifests[selected],
    isEditing
  }
}

export default connect(mapStateToProps, {
  getManifests,
  saveNewManifest,
  deleteManifest,
  toggleEdit,
  saveManifest,
  copyManifest,
  submitManifest,
  fetchManifestResults
})(Manifests)
