import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getManifests, toggleManifestsFilter, selectManifest } from '../../actions/manifest_actions'
import VisibleManifests from './visible_manifests'
import ManifestFilters from './manifest_filters'

class Manifests extends Component {
  componentDidMount() {
    this.props.getManifests()
  }

  handleFilterSelect(e) {
    this.props.toggleManifestsFilter(e.target.value)
  }

  render() {
    return (
      <div>
      {this.props.selectedManifest ? <div>Something</div> :
        <div className='manifests-container'>
          <ManifestFilters 
            handleSelect={this.props.toggleManifestsFilter}
            accessFilters={['private', 'public']}
            selectedFilter={this.props.filter} />
          <VisibleManifests 
            visibleManifests={this.props.visibleManifests}
            handleClick={this.props.selectManifest} />
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
  toggleManifestsFilter,
  selectManifest
})(Manifests)