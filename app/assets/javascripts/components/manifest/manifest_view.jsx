// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ButtonBar from '../button_bar';
import Consignment from '../../models/consignment';

// Module imports.
import {manifestScript} from './manifest_script';
import {manifestResult} from './manifest_result';
import * as ManifestActions from '../../actions/manifest_actions';
import * as ManifestSelector from '../../selectors/manifest_selector';
import * as ConsignmentSelector from '../../selectors/consignment_selector';

export class ManifestView extends React.Component{
  constructor(props){
    super(props);

    if(props.manifest){
      this.state = {
        manifest: ManifestSelector.cloneManifest(props),
        view_mode: 'script',
        is_editing: (props.manifest.id == 0) ? true : false,
        page_status: '',
        parse_error_msg: ''
      };
    }
    else{
      this.state = {
        manifest: {},
        view_mode: 'script',
        is_editing: false,
        page_status: '',
        parse_error_msg: ''
      };
    }
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
      manifest: ManifestSelector.cloneManifest(this.props),
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
        };
        setTimeout(status.bind(this), 1500);
      }
    }

    return new_state;
  }

  updateField(field_name){
    return (event)=>{
      let manifest = this.state.manifest;
      manifest[field_name] = event.target.value;
      this.setState({manifest});
    };
  }

  updateElement(field_name, index){
    return (event)=>{
      let manifest = this.state.manifest;
      manifest.data.elements[index][field_name] = event.target.value;
      this.setState({manifest});
    };
  }

  updateElementsArray(){
    return (event)=>{
      let manifest = this.state.manifest;
      manifest.data.elements = event.target.value;
      this.setState({manifest});

      try {
        JSON.parse(manifest.data.elements)
        this.setState({parse_error_msg: ''});
      }
      catch(e) {
        this.setState({parse_error_msg: e.message})

        return;
      }
    };
  }

  cloneManifest() {
    let {manifest} = this.state;
    let manifest_elems = JSON.parse(manifest.data.elements);
    let cloneManifestObject =  JSON.parse(JSON.stringify(manifest));
    cloneManifestObject.data.elements = manifest_elems;
    return cloneManifestObject;
  }

  updateManifest(){
    let {manifest} = this.state;
    this.setState({page_status: 'SAVING...'});

    // A new manifest should have an id set to 0.
    if(manifest.id <= 0){
      this.props.saveNewManifest(this.cloneManifest());
      return;
    }

    /*
     * Here the manifest has a normal id. We don't need to check it but being
     * explicit is good. Just in case the id ends up in a werid state.
     */
    if(manifest.id > 0) this.props.saveManifest(this.cloneManifest());
  }

  cancelEdit(){

    // Clear out an unsaved manifest.
    if(this.state.manifest.id <= 0 || this.state.manifest.id == null){
      this.props.selectManifest(null);
    }

    // Reset the manifest
    this.setState({
      manifest: ManifestSelector.cloneManifest(this.props),
      page_status: '',
      parse_error_msg: ''
    });

    // Turn off the editing mode.
    this.toggleEdit();
  }

  toggleEdit(){
    this.setState({
      view_mode: 'script',
      is_editing: (!this.state.is_editing),
      page_status: (!this.state.is_editing) ? 'EDITING' : ''
    });
  }

  editableButtons(){
    let {manifest} = this.state;
    let {deleteManifest, copyManifest} = this.props;
    let {is_editable} = this.state.manifest;

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
        click: ()=>{copyManifest(this.cloneManifest());},
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
    let {manifest, parse_error_msg} = this.state;
    return [
      this.state.manifest && {
        click: this.updateManifest.bind(this),
        icon: 'floppy-o',
        label: ' SAVE',
        disabled: parse_error_msg ? 'disabled' : ''
      },
      {
        click: this.cancelEdit.bind(this),
        icon: 'ban',
        label: ' CANCEL',
        disabled: ''
      }
    ].filter(button=>button);
  }

  renderElementButtons(){
    let {manifest, view_mode, is_editing, parse_error_msg} = this.state;
    let {consignment, requestConsignments} = this.props;
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
        {parse_error_msg && 
          <span className ='parse-error-message'>
            {parse_error_msg}
          </span>
        }
      </div>
    );
  }

  renderManifestElements(){
    let {manifest, view_mode, is_editing} = this.state;
    let {consignment} = this.props;
    let disabled = (!is_editing) ? 'disabled' : '';
    let manifest_elements = manifest.data.elements || '';
   
    let textarea_props = {
      className: `${disabled} manifest-form-element-textarea`,
      onChange: this.updateElementsArray(),
      value: manifest_elements,
      disabled
    };

    if(view_mode == 'script' && !is_editing){
      return (
        <pre className='manifest-form-element-pre'>{manifest_elements}</pre>
      );
    }
    
    if (view_mode == 'script' && is_editing){
      return <textarea {...textarea_props}></textarea>;
     }

    // Setup consignment selection.
    manifest_elements = manifest_elements.map((element, index)=>{

      // Pull the data for this element.
      let {name, script, description} = element;
      let consignment_result = null;
      if(consignment && consignment[name]){
        consignment_result = consignment[name];
      }

      // Set up the properties for this component.
      let input_props = {
        className: 'disabled  manifest-form-element-title-input',
        onChange: this.updateElement('name', index),
        type: 'text',
        value: name,
      };

      if(view_mode == 'consignment' && !is_editing && consignment_result!=null){

        // Render the component.
        return(
          <div className='manifest-form-element' key={'element-'+index}>

            <div className='manifest-form-element-title'>

              {'@'}
              <input {...input_props} />
            </div>
            <span>

              {' = '}
            </span>
            <br />
            {manifestResult(name, consignment_result)}
          </div>
        );
      }
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
    let {is_editing, page_status} = this.state;
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

                {page_status}
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
  let consignment = ConsignmentSelector.selectConsignment(
    state,
    own_props.manifest.md5sum_data
  );

  return {...own_props, consignment};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestConsignments: (manifest)=>{
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
