import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getManifests } from '../../actions/manifest_actions'

const ManifestPreview = ({name, project, updated_at, description, is_editable, user}) => (
  <div className='manifest-preview'>
    <div className='name'>{name}</div>
    <div className='created-by'> created by: {user.name}</div>
    <div className='updated-time'>last updated: {updated_at}</div>
    <div className='project'>{project}</div>
    <div className='description'>{description}</div>
  </div>
)

class Manifests extends Component {
  componentDidMount() {
    this.props.getManifests()
  }

  render() {
    const visibleManifests = this.props.visibleManifests.map(manifest => (
      <li key={manifest.id}>
        <ManifestPreview {...manifest} />
      </li>
    ))

    return (
      <div className='manifests-container'>
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
  getManifests
})(Manifests)