// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ListSelector from '../list_selector';
import ManifestForm from './manifest_form';
import ManifestView from './manifest_view';

// Module imports.
import {requestManifests, toggleEdit, selectManifest} from '../../actions/manifest_actions';
import {getSelectedManifest, getAllManifests} from '../../selectors/manifest';

// Main component for viewing/editing manifests.
export class Manifests extends React.Component{
  componentDidMount(){
    this.props.requestManifests();
  }

  create(){
    this.props.selectManifest(null);
    this.props.toggleEdit();
  }

  renderManifests(){

    let {is_admin, is_editing, selected_manifest} = this.props;
    let manifest_props = {isAdmin: is_admin, manifest: selected_manifest};

    if(selected_manifest || is_editing){
      return(
        <div className='manifest-container'>

          {(is_editing) ? <ManifestForm {...manifest_props}/> : <ManifestView {...manifest_props} />}
        </div>
      );
    }
    else{
      return null;
    }
  }

  render(){
    let {sections, selected_manifest, is_admin, is_editing} = this.props;
    let list_selector_props = {
      name: 'Manifest',
      create: this.create.bind(this),
      select: this.props.selectManifest,
      sections: sections
    };

    return (
      <div className='manifests-group'>

        <ListSelector {...list_selector_props} />
        <div className='manifest-view'>

          {this.renderManifests()}
        </div>
      </div>
    );
  }
}

const accessFilter = (access, manifests)=>{
  return manifests.filter(m => m.access == access).sort((a,b) => a > b);
};

const mapStateToProps = (state = {}, own_props)=>{
  let {manifestsUI: {isEditing}} = state;
  let manifests = getAllManifests(state);

  let sections = {
    Public: accessFilter('public', manifests),
    Private: accessFilter('private', manifests)
  };

  return {
    sections,
    selected_manifest: getSelectedManifest(state),
    is_editing: isEditing
  }
}

export default ReactRedux.connect(
  mapStateToProps,
  {requestManifests, toggleEdit, selectManifest}
)(Manifests);
