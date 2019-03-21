// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import DocumentWindow from '../document/document_window';
import ManifestScript from './manifest_script';
import ConsignmentView from './consignment_view';
import {
  requestManifests, saveNewManifest, saveManifest,
  copyManifest, deleteManifest, requestConsignments
} from '../../actions/manifest_actions';
import { pushLocation } from '../../actions/location_actions';
import { getAllManifests } from '../../selectors/manifest_selector';
import { selectConsignment, MD5 } from '../../selectors/consignment_selector';

// Wrapper for consignment selection
class ManifestWindow extends React.Component {
  runManifest() {
    let { consignment, requestConsignments, document } = this.props;
    if(!consignment) requestConsignments([document.script]);
  }

  render() {
    let { consignment } = this.props;
    return <DocumentWindow
      onRun={ consignment ? null : this.runManifest.bind(this) }
      { ...this.props }
    />
  }
}

ManifestWindow = connect(
  // map state
  (state = {}, {md5sum})=>({
    consignment: md5sum && selectConsignment(state, md5sum)
  }),

  // map dispatch
  { requestConsignments }
)(ManifestWindow);

// Main component for viewing/editing manifests.
class Manifests extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  componentDidMount(){
    // load all manifests for the selector
    this.props.requestManifests();
  }

  componentDidUpdate() {
    let { manifest_id, manifests } = this.props;
    let { manifest } = this.state;

    if (manifest_id && manifests && !manifest) this.selectManifest(manifest_id, false);
  }

  create() {
    this.selectManifest('new', true);
  }

  setManifest(manifest) {
    this.selectManifest(manifest.id)
  }

  selectManifest(id, push=true) {
    let { manifests, pushLocation } = this.props;
    let manifest;

    switch(id) {
      case 'new':
        let date = new Date;
        manifest = {
          id: 0,
          access: 'private',
          name: '',
          description: '',
          script: '',
          created_at: date.toString(),
          updated_at: date.toString()
        }
        break;
      case null:
        manifest = null;
        break;
      default:
        // find it in the existing manifests
        manifest = manifests && manifests.find(m=>m.id ==id);
        if (!manifest) return;

        // copy it so you don't modify the store
        manifest = { ...manifest };
        break;
    }

    this.setState({
      manifest,
      md5sum: manifest ? MD5(manifest.script) : null,
      editing: id == 'new'
    });

    if (push) pushLocation(
      id == null ?
      Routes.manifests_path(TIMUR_CONFIG.project_name) :
      Routes.manifest_path(TIMUR_CONFIG.project_name, id)
    );
  }

  updateField(field_name){
    return (event)=>{
      let { manifest, md5sum } = this.state;
      let new_md5sum;

      if (field_name == 'script') {
        // the code editor does not emit an event, just the new value
        manifest.script = event;
        new_md5sum = MD5(manifest.script);
      } else {
        manifest[field_name] = event.target.value;
      }
      this.setState({manifest, md5sum: new_md5sum || md5sum});
    }
  }

  saveManifest() {
    let { manifest, editing } = this.state;
    // A new manifest should have an id set to 0.
    if(manifest.id <= 0)
      this.props.saveNewManifest(manifest,this.setManifest.bind(this));
    else
      this.props.saveManifest(manifest);

    if (editing) this.toggleEdit();
  }

  copyManifest() {
    let { manifest } = this.state;
    this.props.copyManifest(manifest, this.setManifest.bind(this));
  }

  deleteManifest() {
    let { manifest } = this.state;
    if(confirm('Are you sure you want to remove this manifest?')){
      this.props.deleteManifest(manifest, () => this.selectManifest(0));
    }
  }

  revertManifest() {
    let { manifest: { id }, editing } = this.state;

    if (id > 0) this.selectManifest(id);
    else this.selectManifest(null);

    if (editing) this.toggleEdit();
  }

  toggleEdit(){
    this.setState({
      editing: (!this.state.editing)
    });
  }

  render(){
    let { manifests, is_admin, component_name } = this.props;
    let { manifest, md5sum, editing } = this.state;

    return(
      <ManifestWindow
        md5sum={ md5sum }
        documentType='manifest'
        editing={ editing }
        document={ manifest }
        documents={manifests}
        onCreate={this.create.bind(this)}
        onSelect={this.selectManifest.bind(this)}
        onUpdate={ this.updateField.bind(this) }
        onEdit={ this.toggleEdit.bind(this) }
        onCancel={ this.revertManifest.bind(this) }
        onSave={ this.saveManifest.bind(this) }
        onCopy={ this.copyManifest.bind(this) }
        onRemove={ this.deleteManifest.bind(this) } >
        <ManifestScript
          script={manifest && manifest.script}
          is_editing={editing}
          onChange={ this.updateField.bind(this)('script') }/>
        <ConsignmentView md5sum={md5sum}/>
      </ManifestWindow>
    );
  }
}

export default connect(
  // map state
  (state)=>({
    manifests: getAllManifests(state)
  }),
  // map dispatch
  {
    requestManifests, saveNewManifest, saveManifest, copyManifest, deleteManifest, requestConsignments,
    pushLocation
  }
)(Manifests);
