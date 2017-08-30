import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestManifests } from '../../actions/manifest_actions'
import Manifest from './manifest'
import ManifestSelector from './manifest_selector'
import debounce from 'lodash.debounce'

// Main component for viewing/editing manifests
class Manifests extends Component {
  componentDidMount() {
    this.props.requestManifests()
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
            manifest={this.props.manifest}
            />
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
  requestManifests
})(Manifests)
