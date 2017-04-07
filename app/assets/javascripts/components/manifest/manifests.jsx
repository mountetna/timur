import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getManifests, deleteManifest } from '../../actions/manifest_actions'
import ManifestPreview from './manifest_preview'

class Manifests extends Component {
  componentDidMount() {
    this.props.getManifests()
  }

  render() {
    const visibleManifests = this.props.visibleManifests.map(manifest => {
      const handleDelete = () => this.props.deleteManifest(manifest.id)
      const props = {...manifest, handleDelete: handleDelete}
      return (
        <li key={manifest.id}>
          <ManifestPreview {...props} />
        </li>
      )
    })

    return (
      <div className='manifests-container'>
        <button>New Manifest</button>
        <ol>
          {visibleManifests}
        </ol>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { manifests, manifestsUI } = state
  //filter by access 'public' or 'private'
  const filteredManifests = Object.keys(manifests).reduce((acc, id) => {
    if (!manifestsUI.filter || manifests[id].access === manifestsUI.filter) {
      return [ ...acc, manifests[id] ]
    }
    return acc
  }, [])
  //sort by updated_at
  const visibleManifests = filteredManifests.sort((a, b) => {
    if (a.updated_at > b.updated_at) {
      return -1
    }
    if (a.updated_at < b.updated_at) {
      return 1;
    }
    return 0
  })
  
  return {
    visibleManifests
  }
}

export default connect(mapStateToProps, {
  getManifests,
  deleteManifest
})(Manifests)