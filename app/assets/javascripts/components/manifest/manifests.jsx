import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getManifests, deleteManifest, toggleManifestsFilter, selectManifest } from '../../actions/manifest_actions'
import ManifestPreview from './manifest_preview'

class Manifests extends Component {
  componentDidMount() {
    this.props.getManifests()
  }

  handleFilterSelect(e) {
    this.props.toggleManifestsFilter(e.target.value)
  }

  visibleManifests() {
    return this.props.visibleManifests.map(manifest => {
      const handleDelete = () => this.props.deleteManifest(manifest.id)
      const handleClick = () => this.props.selectManifest(manifest.id)
      const props = { ...manifest, handleDelete, handleClick }
      return (
        <li key={manifest.id}>
          <ManifestPreview {...props} />
        </li>
      )
    })
  }

  render() {
    return (
      <div>
      {this.props.selectedManifest ? <div>Something</div> :
        <div className='manifests-container'>
          <div className='filters'>
            Filter:
            <input type='radio' value='private'
              onChange={this.handleFilterSelect.bind(this)} 
              checked={this.props.filter === 'private'}/>private
            <input type='radio' value='public'
              onChange={this.handleFilterSelect.bind(this)} 
              checked={this.props.filter === 'public'}/>public
          </div>
          <ol>
            <li><button onClick={this.props.selectManifest.bind(this, 'new')}>New Manifest</button></li>
            {this.visibleManifests()}
          </ol>
        </div>
      }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { manifests, manifestsUI: { filter, selected } } = state
  //filter by access 'public' or 'private'
  const filteredManifests = Object.keys(manifests).reduce((acc, id) => {
    if (!filter || manifests[id].access === filter) {
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
    visibleManifests,
    filter,
    selectedManifest: selected
  }
}

export default connect(mapStateToProps, {
  getManifests,
  deleteManifest,
  toggleManifestsFilter,
  selectManifest
})(Manifests)