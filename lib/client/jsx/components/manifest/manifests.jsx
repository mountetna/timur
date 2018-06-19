// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import md5 from 'md5';

// Class imports.
import ListMenu from '../list_menu';
import ManifestView from './manifest_view';

// Module imports.
import {addTokenUser} from '../../actions/timur_actions';
import {
  requestManifests, saveNewManifest, saveManifest, copyManifest, deleteManifest
} from '../../actions/manifest_actions';
import {
  getAllManifests,
  getSelectedManifest
} from '../../selectors/manifest_selector';

// Main component for viewing/editing manifests.
export class Manifests extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    /*
     * This function must run for any new manifest to process correctly. It
     * allows the manifest selector to properly set the current user on a new
     * manifest.
     */
    this.props.addTokenUser();
    this.props.requestManifests();
  }

  create() {
    // A manifest with an id of '0' is a new manifest.
    let date = new Date;
    let manifest = {
      id: 0,
      access: 'private',
      name: '',
      description: '',
      script: '',
      created_at: date.toString(),
      updated_at: date.toString()
    };
    this.setState({manifest});
  }

  setManifest({manifest}) {
    this.selectManifest(manifest.id)
  }

  selectManifest(id) {
    if (!id) {
      this.setState({manifest: null, md5sum: null});
      return;
    }

    let { manifests } = this.props;

    let manifest = manifests.find(m=>m.id ==id);

    // copy it so you don't modify the store
    this.setState({
      manifest: { ...manifest },
      md5sum: manifest.md5sum
    });
  }

  updateField(field_name){
    return (event)=>{
      let { manifest, md5sum } = this.state;
      let new_md5sum;

      manifest[field_name] = event.target.value;

      if (field_name == 'script') new_md5sum = md5(manifest.script);
      this.setState({manifest, md5sum: new_md5sum || md5sum});
    }
  }

  saveManifest() {
    let { manifest } = this.state;
    // A new manifest should have an id set to 0.
    if(manifest.id <= 0)
      this.props.saveNewManifest(manifest,this.setManifest.bind(this));
    else
      this.props.saveManifest(manifest);
  }

  copyManifest() {
    let { manifest } = this.state;
    this.props.copyManifest(manifest, this.setManifest.bind(this));
  }

  deleteManifest() {
    let { manifest } = this.state;
    this.props.deleteManifest(manifest, () => this.selectManifest(0));
  }

  revertManifest() {
    let { manifest: { id } } = this.state;

    if (id > 0)
      this.selectManifest(id);
    else
      this.setState({manifest: null});
  }

  render(){
    let { sections, is_admin, component_name } = this.props;
    let { manifest, md5sum } = this.state;

    return(
      <div className='manifest-group'>
        <div className='left-column-group'>
          <ListMenu name='Manifest'
            create={this.create.bind(this)}
            select={this.selectManifest.bind(this)}
            sections={sections}/>
        </div>
        <div className='right-column-group'>
          <ManifestView
            force_edit={ manifest && manifest.id == 0 }
            update={ this.updateField.bind(this) }
            revert={ this.revertManifest.bind(this) }
            save={ this.saveManifest.bind(this) }
            copy={ this.copyManifest.bind(this) }
            remove={ this.deleteManifest.bind(this) }
            md5sum={ md5sum }
            manifest={ manifest } is_admin={ is_admin } />
        </div>
      </div>
    );
  }
}

const accessFilter = (access, manifests)=>{
  return manifests.filter(m => m.access == access).sort((a,b) => a > b);
};


export const ManifestsContainer = ReactRedux.connect(
  // map state
  (state)=>{
    let manifests = getAllManifests(state);
    let sections = {
      Public: accessFilter('public', manifests),
      Private: accessFilter('private', manifests)
    };

    return {
      sections,
      manifests
    };
  },
  // map dispatch
  { addTokenUser, requestManifests, saveNewManifest, saveManifest, copyManifest, deleteManifest }
)(Manifests);
