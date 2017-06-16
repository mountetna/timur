import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getManifests } from '../../actions/manifest_actions'
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
  getManifests
})(Manifests)
