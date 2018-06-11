// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

// Class imports.
import ButtonBar from '../button_bar';
import Consignment from '../../models/consignment';

// Module imports.
import ManifestScript from './manifest_script';

import {manifestResult} from './manifest_result';
import {
  requestConsignments, copyManifest, deleteManifest,
  saveNewManifest, saveManifest
} from '../../actions/manifest_actions';
import { cloneManifest } from '../../selectors/manifest_selector';
import { selectConsignment } from '../../selectors/consignment_selector';

import {formatDate} from '../../utils/dates';


export class ManifestView extends React.Component{
  constructor(props){
    super(props);

    if(props.manifest){
      this.state = {
        manifest: cloneManifest(props),
        view_mode: 'script',
        is_editing: (props.manifest.id == 0) ? true : false,
        page_status: ''
      };
    }
    else{
      this.state = {
        manifest: {},
        view_mode: 'script',
        is_editing: false,
        page_status: ''
      };
    }

    this.buttons = {
      copy: {
        click: ()=>{this.props.copyManifest(manifest);},
        icon: 'files-o',
        label: 'COPY'
      },
      delete: {
        click: ()=>{
          if(confirm('Are you sure you want to remove this manifest?')){
            this.props.deleteManifest(manifest.id);
          }
        },
        icon: 'trash-o',
        label: 'DELETE'
      },
      edit: {
        click: this.toggleEdit.bind(this),
        icon: 'pencil-square-o',
        label: 'EDIT'
      },
      run: {
        icon: 'play',
        label: 'RUN',
        click: (event)=>{
          if(is_editing) this.toggleEdit();
          this.setState({view_mode: 'consignment'});
          if(!consignment) requestConsignments(manifest);
        }
      },
      save: {
        click: this.updateManifest.bind(this),
        icon: 'floppy-o',
        label: 'SAVE'
      },
      cancel: {
        click: this.cancelEdit.bind(this),
        icon: 'ban',
        label: 'CANCEL'
      }
    };
  }

  /*
   * When a new manifest is selected it is set on the 'props'. However, to
   * redraw the new manifest we then need to map it to the 'state'.
   */
  componentDidUpdate(){

    /*
     * If the manifest doesn't exist or if the current manifest prop equals 
     * the current manifest state, then bail. This check MUST happen or else you
     * get a state update loop.
     */
    if(!this.props.manifest) return;
    if(this.props.manifest.md5sum == this.state.manifest.md5sum) return;

    /*
     * If the manifest is new (id == 0) or the manifest is editable and we are
     * in edit mode then turn on editing.
     */
    let is_editing = false;
    if(
      (this.props.manifest.id == 0) ||
      (this.props.manifest.is_editable && this.state.is_editing)
    ){
      is_editing = true;
    }

    /*
     * At this point we want to clone the manifest so any cancelled changes can
     * be reversed.
     */
    let new_state = {
      manifest: cloneManifest(this.props),
      view_mode: 'script',
      is_editing
    };

    new_state = this.toggleSavedNotice(new_state);
    this.setState(new_state);
  }

  /*
   * This will toggle the 'SAVED' notice 'on' or 'off'. We check that the
   * manifest is the same (by id) and that the update stamps are different
   * (which indicates a successful save).
   */
  toggleSavedNotice(new_state){
    if(
      (this.props.manifest.id == this.state.manifest.id) ||
      (this.props.manifest.id > 0 && this.state.manifest.id == 0)
    ){
      if(
        new Date(this.props.manifest.updated_at).getTime() >
        new Date(this.state.manifest.updated_at).getTime()
      ){
        new_state['page_status'] = 'SAVED';
        let status = ()=>{
          this.setState({
            'page_status': (this.state.is_editing) ? 'EDITING': ''
          });
        }
        setTimeout(status.bind(this), 1500);
      }
    }

    return new_state;
  }

  updateManifest(){
    let manifest = this.state.manifest;
    this.setState({page_status: 'SAVING...'});

    // A new manifest should have an id set to 0.
    if(manifest.id <= 0){
      this.props.saveNewManifest(manifest);
      return;
    }

    /*
     * Here the manifest has a normal id. We don't need to check it but being
     * explicit is good. Just in case the id ends up in a werid state.
     */
    if(manifest.id > 0) this.props.saveManifest(manifest);
  }

  cancelEdit(){

    // Clear out an unsaved manifest.
    if(this.state.manifest.id <= 0 || this.state.manifest.id == null){
      this.props.selectManifest(null);
    }

    // Reset the manifest
    this.setState({
      manifest: cloneManifest(this.props),
      page_status: ''
    });

    // Turn of the editing mode.
    this.toggleEdit();
  }

  toggleEdit(){
    this.setState({
      view_mode: 'script',
      is_editing: (!this.state.is_editing),
      page_status: (!this.state.is_editing) ? 'EDITING' : ''
    });
  }

  getButtons() {
    let { manifest, view_mode, is_editing } = this.state;
    return [ this.buttons.run ].concat(
      is_editing ? [
        manifest && this.buttons.save,
        this.buttons.cancel
      ] : [
        view_mode == 'output' && this.buttons.plot,
        this.buttons.copy,
        manifest && this.buttons.delete,
        manifest && this.buttons.edit,
      ]
    ).filter(button=>button);
  }

  updateField(field_name){
    return (event)=>{
      let manifest = this.state.manifest;
      manifest[field_name] = event.target.value;
      this.setState({manifest});
    }
  }

  updateScript(event) {
    let { manifest } = this.state;

    this.setState({ manifest: { ...manifest, script: event.target.value } });
  }

  renderManifestBody(){
    let {manifest, view_mode, is_editing} = this.state;
    let {consignment} = this.props;
    let disabled = (!is_editing) ? 'disabled' : '';

    let { script } = manifest;

    //if(view_mode == 'consignment' && !is_editing && consignment_result!=null){
    //manifest_elem = manifestResult(name, consignment_result);
    //}

    // Render the component.
    return(
      <ManifestScript
        script={script}
        is_editing={is_editing}
        onChange={ this.updateScript.bind(this) }/>
    );
  }

  render(){
    let { manifest } = this.props;

    if (manifest == null) return null;

    let {name, user, updated_at, description, access} = this.state.manifest;
    let {is_editing, page_status} = this.state;
    let disabled = (!is_editing) ? 'disabled' : '';

    let input_props = {
      className: 'manifest-form-title-input',
      onChange: this.updateField('name'),
      value: name,
      type: 'text',
      disabled
    };

    let textarea_props = {
      onChange: this.updateField('description'),
      value: (description) ? description : '',
      disabled
    };

    let buttons = this.getButtons();

    let priv_props = {
      name: 'manifest-access',
      value: 'private',
      onChange: this.updateField('access'),
      type: 'radio',
      disabled
    };

    let pub_props = {
      name: 'manifest-access',
      value: 'public',
      onChange: this.updateField('access'),
      type: 'radio',
      disabled
    };

    if(access == 'private'){
      priv_props.checked = 'checked';
    }
    else{
      pub_props.checked = 'checked';
    }

    return(
      <div className='manifest-elements'>
        <div className='manifest-form-group'>
          <div className='manifest-form-header'>
            <div className='manifest-form-title'>
              <input {...input_props} />
              <ButtonBar className='manifest-action-btn-group' buttons={buttons} />
              <span style={{float: 'right'}}>
                {page_status}
              </span>
            </div>
            <div className='manifest-form-details'>
              Updated <strong>{ formatDate(updated_at) }</strong> by <strong>{user}</strong>
              <br />
              Access
              <input {...priv_props} />{'PRIVATE'}
              <input {...pub_props} />{'PUBLIC'}
              <br />
              <textarea className='manifest-form-description' {...textarea_props} />
            </div>

          </div>
          <div className='manifest-form-body'>
            {this.renderManifestBody()}
          </div>
        </div>
      </div>
    );
  }
}

const selectManifest = (id)=> ({ type: 'SELECT_MANIFEST', id });

export default connect(
  // map state
  (state = {}, {manifest})=>{
    let consignment = selectConsignment(
      state,
      manifest.md5sum
    );

    return {consignment};
  },

  // map dispatch
  {
    requestConsignments, copyManifest, deleteManifest,
    saveNewManifest, saveManifest, selectManifest
  }
)(ManifestView);
