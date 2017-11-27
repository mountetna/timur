// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ButtonBar from '../button_bar';

// Module imports.
import {manifestScript} from './manifest_script';
import {manifestResult} from './manifest_result';
import {selectConsignment} from '../../selectors/consignment';
import * as ManifestActions from '../../actions/manifest_actions';

export class ManifestView extends React.Component{
  constructor(props){
    super(props);

    if(props.manifest){
      this.state = {
        manifest: this.cloneManifest(props),
        view_mode: 'script'
      };
    }
    else{
      this.state = {
        manifest: {},
        view_mode: 'script'
      };
    }
  }

  componentDidUpdate(){

    /*
     * If the manifest doesn't exist or if the current manifest prop equals 
     * the current manifest state, then bail. This check MUST happen or else you
     * get a state update loop.
     */
    if(!this.props.manifest||(this.props.manifest.id==this.state.manifest.id)){
      return;
    }

    this.setState({manifest: this.cloneManifest(this.props)});
  }


  cloneManifest(props){
    let manifest = Object.assign({}, props.manifest);
    manifest.data = Object.assign({}, props.manifest.data);

    /*
     * Sometimes a user can save a manifest without any elements. In this case
     * the elements here will be null and we need to set the data elements to
     * an empty array.
     */
    if(props.manifest.data.elements == null){
      manifest.data.elements = [];
    }
    else{
      manifest.data.elements = props.manifest.data.elements.slice();
    }

    return manifest;
  }

  updateField(field_name){
    return (event)=>{
      let manifest = this.state.manifest;
      manifest[field_name] = event.target.value;
      this.setState({manifest});
    }
  }

  updateElement(field_name, index){
    return (event)=>{
      let manifest = this.state.manifest;
      manifest.data.elements[index][field_name] = event.target.value;
      this.setState({manifest});
    }
  }

  removeElement(index){
    let manifest = this.state.manifest;

    // Check that the index is within bounds.
    if(index > (manifest.data.elements.length-1) || index < 0) return;

    manifest.data.elements.splice(index, 1);
    this.setState({manifest});
  }

  updateManifest(){
    let manifest = this.state.manifest;

    // A new manifest should have an id set to 0.
    if(manifest.id <= 0){
      this.props.saveNewManifest(manifest);
      return;
    }

    /*
     * Here the manifest has a normal id. We don't need to check it but being
     * explicit is good. Just in case the id ends up in a werid state.
     */
    if(manifest.id > 0){
      this.props.saveManifest(manifest);
    }
  }

  cancelEdit(){

    // Clear out an unsaved manifest.
    if(this.state.manifest.id <= 0 || this.state.manifest.id == null){
      this.props.selectManifest(null);
    }

    // Reset the manifest
    this.setState({manifest: this.cloneManifest(this.props)});

    // Turn of the editing mode.
    this.toggleEdit();
  }

  toggleEdit(){
    this.setState({view_mode: 'script'});
    this.props.toggleEdit();
  }

  addElement(){
    let manifest = this.state.manifest;
    manifest.data.elements.push({description: '', name: '', script: ''});
    this.setState({manifest});
  }

  editableButtons(){
    let {manifest} = this.state;
    let {deleteManifest, copyManifest} = this.props;
    let {is_editable} = manifest;

    return [
      is_editable && this.state.view_mode == 'output' && {
        click: ()=>{
          location.href = plotIndexUrl({
            manifest_id: manifest.id,
            is_editing: true
          });
        },
        icon: 'line-chart',
        label: ' PLOT'
      },
      {
        click: ()=>{copyManifest(manifest)},
        icon: 'files-o',
        label: ' COPY'
      },
      is_editable && {
        click: ()=>{
          if(confirm('Are you sure you want to remove this manifest?')){
            deleteManifest(manifest.id);
          }
        },
        icon: 'trash-o',
        label: ' DELETE'
      },
      is_editable && {
        click: this.toggleEdit.bind(this),
        icon: 'pencil-square-o',
        label: ' EDIT'
      }
    ].filter(button=>button);
  }

  editingButtons(){
    return [
      this.state.manifest && {
        click: this.updateManifest.bind(this),
        icon: 'floppy-o',
        label: ' SAVE'
      },
      {
        click: this.cancelEdit.bind(this),
        icon: 'ban',
        label: ' CANCEL'
      }
    ].filter(button=>button);
  }

  renderElementButtons(){
    let {manifest, view_mode} = this.state;
    let {consignment, requestConsignments, is_editing} = this.props;
    let disabled = (!is_editing) ? 'disabled' : '';

    let query_btn_props = {
      className: 'manifest-query-btn',
      disabled: (view_mode == 'consignment' || is_editing) ? 'disabled' : '',
      onClick: (event)=>{
        if(is_editing) this.toggleEdit();
        this.setState({view_mode: 'consignment'});
        if(!consignment) requestConsignments(manifest);
      }
    };

    let script_btn_props = {
      className: 'manifest-query-btn',
      disabled: (view_mode == 'script' || is_editing) ? 'disabled' : '',
      onClick: (event)=>{
        this.setState({view_mode: 'script'});
        if(!consignment) requestConsignments(manifest);
      }
    };

    let add_btn_props = {
      className: 'manifest-query-btn manifest-add-btn',
      onClick: this.addElement.bind(this),
      disabled
    };

    return(
      <div className='manifest-query-btn-group'>

        <button {...query_btn_props}>

          <i className='fa fa-play' aria-hidden='true'></i>
          {' RUN QUERY'}
        </button>
        <button {...script_btn_props}>

          <i className='fa fa-file-code-o' aria-hidden='true'></i>
          {' SHOW SCRIPT'}
        </button>
        <button {...add_btn_props}>

          <i className='fa fa-plus' aria-hidden='true'></i>
          {' ADD ELEMENT'}
        </button>
      </div>
    );
  }

  renderManifestElements(){
    let {manifest, view_mode} = this.state;
    let {consignment, is_editing} = this.props;
    let disabled = (!is_editing) ? 'disabled' : '';

    let manifest_elements = manifest.data.elements || [];
    manifest_elements = manifest_elements.map((element, index)=>{

      // Pull the data for this element.
      let {name, script, description} = element;
      let consignment_result = null;
      if(consignment && consignment[name]){
        consignment_result = consignment[name];
      }

      // Set up the properties for this component.
      let input_props = {
        className: `${disabled}  manifest-form-element-title-input`,
        onChange: this.updateElement('name', index),
        type: 'text',
        value: name,
        disabled
      };

      let remove_btn_props = {
        className: 'manifest-form-control-btn',
        onClick: (event)=>{
          if(confirm('Are you sure you want to remove this element?')){
            this.removeElement(index);
          }
        },
        disabled
      };

      let textarea_props = {
        className: `${disabled} manifest-form-element-textarea`,
        onChange: this.updateElement('script', index),
        value: script,
        disabled
      };

      // Set the individual manifest element based upon the view and edit modes.
      let manifest_elem = null;
      if(view_mode == 'consignment' && !is_editing && consignment_result!=null){
        manifest_elem = manifestResult(name, consignment_result);
      }
      else if(view_mode == 'script' && !is_editing){
        manifest_elem = manifestScript(script);
      }
      else if(view_mode == 'script' && is_editing){
        manifest_elem = <textarea {...textarea_props}></textarea>;
      }

      // Render the component.
      return(
        <div className='manifest-form-element' key={'element-'+index}>

          <div className='manifest-form-element-title'>

            {'@'}
            <input {...input_props} />
            <button {...remove_btn_props}>

              <i className='fa fa-times' aria-hidden='true'></i>
              {' REMOVE'}
            </button>
          </div>
          <span>

            {' = '}
          </span>
          <br />
          {manifest_elem}
        </div>
      );
    });

    return manifest_elements;
  }

  render(){

    /*
     * When the manifest is null return an empty page. This happens on the 
     * initial page load.
     */
    if(this.props.manifest == null) return null;

    let {name, user, updated_at, description, access} = this.state.manifest;
    let {is_editing} = this.props;
    let disabled = (!is_editing) ? 'disabled' : '';

    let input_props = {
      className: `${disabled} manifest-form-title-input`,
      onChange: this.updateField('name'),
      value: name,
      type: 'text',
      disabled
    };

    let textarea_props = {
      className: `${disabled} manifest-form-description`,
      onChange: this.updateField('description'),
      value: (description) ? description : '',
      disabled
    };

    let buttons;
    if(is_editing){
      buttons = this.editingButtons();
    }
    else{
      buttons = this.editableButtons();
    }

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

              {'NAME: '}
              <input {...input_props} />
              <ButtonBar className='manifest-action-btn-group' buttons={buttons} />
              <span style={{float: 'right'}}>

                {(is_editing) ? 'EDIT MODE' : ''}
              </span>
            </div>
            <br />
            <div className='manifest-form-details'>

              {`AUTHOR: ${user.name}`}
              <br />
              {`LAST UPDATED: ${updated_at}`}
              <br />
              {'ACCESS: '}
              <input {...priv_props} />{'PRIVATE'}
              <input {...pub_props} />{'PUBLIC'}
              <br />
              {'DESCRIPTION: '}
              <br />
              <textarea {...textarea_props} />
            </div>

          </div>
          {this.renderElementButtons()}
          <div id='manifest-form-body'>

            {this.renderManifestElements()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{

  /*
   * Only return a possible consignment (there won't be one if we havent yet run
   * the query) if we are not in an edit mode.
   */
  let consignment = null;
  if(!own_props.is_editing){
    consignment = selectConsignment(state, own_props.manifest.id);
  }

  return {...own_props, consignment};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestConsignments: (manifest)=>{
      manifest = ManifestActions.manifestToReqPayload(manifest);
      dispatch(ManifestActions.requestConsignments([manifest]));
    },

    copyManifest: (manifest_record)=>{
      dispatch(ManifestActions.copyManifest(manifest_record));
    },

    deleteManifest: (manifest_id)=>{
      dispatch(ManifestActions.deleteManifest(manifest_id));
    },

    saveNewManifest: (manifest)=>{
      dispatch(ManifestActions.saveNewManifest(manifest));
    },

    saveManifest: (manifest)=>{
      dispatch(ManifestActions.saveManifest(manifest));
    },

    toggleEdit: ()=>{
      dispatch({
        type: 'TOGGLE_IS_EDITING_MANIFEST'
      });
    },

    selectManifest: (id)=>{
      dispatch({
        type: 'SELECT_MANIFEST',
        id
      });
    },
  };
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestView);
