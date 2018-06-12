// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

// Class imports.
import ButtonBar from '../button_bar';

// Module imports.
import ManifestScript from './manifest_script';
import ConsignmentView from './consignment_view';

import {
  requestConsignments
} from '../../actions/manifest_actions';
import { cloneManifest } from '../../selectors/manifest_selector';
import { selectConsignment } from '../../selectors/consignment_selector';

import {formatDate} from '../../utils/dates';


export class ManifestView extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      is_editing: false,
    };

    this.buttons = {
      copy: {
        click: ()=>{this.props.copy();},
        icon: 'files-o',
        label: 'COPY'
      },
      remove: {
        click: ()=>{
          if(confirm('Are you sure you want to remove this manifest?')){
            this.props.remove();
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
        click: this.runManifest.bind(this)
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

  runManifest() {
    let { consignment, requestConsignments, manifest } = this.props;
    if(!consignment) requestConsignments([manifest]);
  }

  updateManifest() {
    let { is_editing } = this.state;

    this.props.save();

    if (is_editing) this.toggleEdit();
  }

  cancelEdit(){
    // Reset the manifest
    this.props.revert()

    // Turn of the editing mode.
    this.toggleEdit();
  }

  toggleEdit(){
    this.setState({
      is_editing: (!this.state.is_editing)
    });
  }

  editState() {
    let { is_editing } = this.state;
    let { force_edit } = this.props;

    return force_edit || is_editing;
  }

  getButtons() {
    let is_editing = this.editState();
    let { consignment } = this.props;
    let { run, save, cancel, plot, copy, remove, edit } = this.buttons;
    return [
      !consignment && run,
      is_editing && save,
      is_editing && cancel,
      !is_editing && copy,
      !is_editing && remove,
      !is_editing && edit
    ].filter(button=>button);
  }

  render(){
    let { consignment, manifest, update } = this.props;

    if (manifest == null) return null;

    let {script, name, user, updated_at, description, access} = manifest;
    let is_editing = this.editState();
    let disabled = (!is_editing) ? 'disabled' : '';

    let buttons = this.getButtons();

    let input_props = {
      className: 'manifest-form-title-input',
      onChange: update('name'),
      value: name,
      placeholder: 'No name',
      type: 'text',
      disabled
    };

    let textarea_props = {
      onChange: update('description'),
      value: (description) ? description : '',
      placeholder: 'No description',
      disabled
    };

    let access_props = {
      name: 'manifest-access',
      onChange: update('access'),
      type: 'radio',
      disabled
    };

    return(
      <div className='manifest-elements'>
        <div className='manifest-form-group'>
          <div className='manifest-form-header'>
            <div className='manifest-form-title'>
              <input {...input_props} />
              <ButtonBar className='manifest-action-btn-group' buttons={buttons} />
              <span style={{float: 'right'}}>
                {is_editing && 'EDITING'}
              </span>
            </div>
            <div className='manifest-form-details'>
              Updated <strong>{ formatDate(updated_at) }</strong> by <strong>{user}</strong>
              <br />
              Access
              <input value='private' checked={access=='private'} {...access_props} />{'PRIVATE'}
              <input value='public' checked={access=='public'} {...access_props} />{'PUBLIC'}
              <br />
              <textarea className='manifest-form-description' {...textarea_props} />
            </div>

          </div>
          <ManifestScript
            script={script}
            is_editing={is_editing}
            onChange={ update('script') }/>
          <ConsignmentView consignment={consignment}/>
        </div>
      </div>
    );
  }
}

export default connect(
  // map state
  (state = {}, {manifest,md5sum})=>{
    return {
      consignment: md5sum && selectConsignment(state, md5sum)
    };
  },

  // map dispatch
  {
    requestConsignments
  }
)(ManifestView);
