import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestManifests, toggleEdit, selectManifest} from '../../actions/manifest_actions';
import ListSelector from '../list_selector';
import Manifest from './manifest';
import { getSelectedManifest, getAllManifests } from '../../selectors/manifest';

// Main component for viewing/editing manifests
class Manifests extends Component {
  componentDidMount() {
    this.props.requestManifests()
  }

  create() {
    this.props.selectManifest(null);
    this.props.toggleEdit()
  }

  render() {
    const { sections, selectedManifest } = this.props

    return (
      <div className='manifests-container'>
        <ListSelector
          name='Manifest'
          create={ this.create.bind(this) }
          select={ this.props.selectManifest }
          sections={ sections }/>
        <div className='manifest-view'>
        { (selectedManifest || this.props.isEditing) ?
          <Manifest
            isAdmin={this.props.isAdmin}
            editing={this.props.isEditing}
            manifest={this.props.selectedManifest}
            />
            : null
        }
        </div>
      </div>
    )
  }
}

const accessFilter = (access, manifests) =>
  manifests.filter(m => m.access == access)
    .sort((a,b) => a > b);

const mapStateToProps = (state) => {
  const { manifestsUI: { isEditing } } = state
  let manifests = getAllManifests(state);

  let sections = {
    Public: accessFilter('public', manifests),
    Private: accessFilter('private', manifests)
  }

  return {
    sections,
    selectedManifest: getSelectedManifest(state),
    isEditing
  }
}

export default connect(mapStateToProps, {
  requestManifests, toggleEdit, selectManifest
})(Manifests)
