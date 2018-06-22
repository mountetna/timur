// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ListMenu from '../list_menu';
import ButtonBar from '../button_bar';

// Module imports.
import {
  requestViewSettings,
  updateViewSettings,
  deleteViewSettings
} from '../../actions/timur_actions';

export class SettingsView extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      view_settings_object: null,
      selected_model_name: null,
      is_editing: false,
      page_status: '',
      parse_error_message: '',

      // The 'view_settings_string' is the sub object 'tabs'.
      view_settings_string: '',
    };
  }
  
  componentDidMount(){
    this.props.requestViewSettings();
  }

  cloneView(selected_model_name){
    return JSON.parse(JSON.stringify(this.props.views[selected_model_name]));
  }

  stringifyViewTab(selected_model_name){
    return JSON.stringify(this.props.views[selected_model_name].tabs, null, 2);
  }

  updateModelName(event){
    let view_settings_object = this.state.view_settings_object;
    view_settings_object.model_name = event.target.value;

    this.setState({
      selected_model_name: view_settings_object.model_name,
      view_settings_object,
      view_settings_string: JSON.stringify(
        view_settings_object.tabs,
        null,
        2
      )
    });
  }

  // The JSON.parse here will throw an error if the data is not valid.
  updateTabData(event){
    try{
      let view_obj = this.state.view_settings_object
      view_obj.tabs = JSON.parse(event.target.value);

      this.setState({
        view_settings_object: view_obj,
        view_settings_string: event.target.value,
        parse_error_message: ''
      });
    }
    catch(err){
      this.setState({
        view_settings_string: event.target.value,
        parse_error_message: err.message
      });
      return;
    }
  }

  selectViewSetting(id){
    if(id == null){
      this.setState({
        view_settings_string: '',
        view_settings_object: null,
        selected_model_name: null,
        is_editing: false
      });
      return;
    }

    let view_items = Object.keys(this.props.views).map((key, index)=>({
      name: this.props.views[key].model_name,
      id: index,
    }));

    this.setState({
      selected_model_name: view_items[id].name,
      view_settings_object: this.cloneView(view_items[id].name),
      view_settings_string: this.stringifyViewTab(view_items[id].name)
    });
  }

  editableButtons(){
    return [
      {
        click: this.deleteView.bind(this),
        icon: 'trash-o',
        label: ' DELETE'
      },
      {
        click: this.toggleEdit.bind(this),
        icon: 'pencil-square-o',
        label: ' EDIT'
      }
    ].filter(button=>button);
  }

  editingButtons(){
    return [
      {
        click: this.saveEdit.bind(this),
        icon: 'floppy-o',
        label: ' SAVE',
        disabled: this.state.parse_error_message ? 'disabled' : ''
      },
      {
        click: this.cancelEdit.bind(this),
        icon: 'ban',
        label: ' CANCEL'
      }
    ].filter(button=>button);
  }

  deleteView(){
    if(!confirm('Are you sure you want to delete this view?')) return;

    this.props.deleteViewSettings(
      this.state.view_settings_object
    );
  }

  // The JSON.parse here will throw an error if the data is not valid.
  saveEdit(){
    try{
      let view_obj = this.state.view_settings_object;
      view_obj.tabs = JSON.parse(this.state.view_settings_string);

      this.props.updateViewSettings(view_obj);
      this.setState({parse_error_message: ''});
      this.toggleEdit();
    }
    catch(err){
      this.setState({parse_error_message: err.message});
    }
  }

  cancelEdit(){

    // Turn off the editing mode.
    this.toggleEdit();

    // If we are cancelling a new view.
    //if(this.state.view_settings_object.id == undefined){
    //  this.selectViewSetting(null);
    //  return;
    //}

    // Reset the view.
    this.setState({
      view_settings_object: this.cloneView(this.state.selected_model_name),
      view_settings_string: this.stringifyViewTab(this.state.selected_model_name),
      page_status: '',
      parse_error_message: ''
    });
  }

  toggleEdit(){
    this.setState({
      is_editing: (!this.state.is_editing),
      page_status: (!this.state.is_editing) ? 'EDITING' : ''
    });
  }

  // This is the main panel in which we inspect view code.
  renderViewTab(){

    let disabled = (!this.state.is_editing) ? 'disabled' : '';
    let tab_code = this.state.view_settings_string;
    let tabs_attributes = {
      className: `${disabled} settings-view-tab-group`,
      value: tab_code,
      onChange: this.updateTabData.bind(this),
      disabled
    };
    return(
      <div className='settings-view-inspector-group'>
        
        <textarea {...tabs_attributes}></textarea>
      </div>
    );
  }

  renderRightColumnGroup(){
    if(this.state.view_settings_object == null) return null;

    let {
      view_settings_object,
      is_editing, 
      page_status,
      parse_error_message
    } = this.state;

    let disabled = (!is_editing) ? 'disabled' : '';

    let input_props = {
      className: 'disabled settings-view-model-title-input',
      value: view_settings_object.model_name,
      type: 'text',
      readOnly: 'readOnly',
      onChange: this.updateModelName.bind(this)
    };

    // Enable the model name input if it's new.
    if(view_settings_object.model_name == '' || is_editing){
      delete input_props['readOnly'];
      input_props['className'] = 'settings-view-model-title-input';
    }

    let buttons;
    if(is_editing){
      buttons = this.editingButtons();
    }
    else{
      buttons = this.editableButtons();
    }
    
    return(
      <div className='settings-view-elements'>
        <div className='settings-view-form-header'>

          <div className='settings-view-form-title'>

            {'NAME: '}
            <input {...input_props} />
            <ButtonBar className='settings-view-action-btn-group' buttons={buttons} />
          
            <span style={{float: 'right'}}>

              {page_status}
            </span>
            {
              parse_error_message &&
                <span className='parse-error-message'>
                  Invalid JSON: {parse_error_message}
                </span>
            }
          </div>
          <br />
        </div>
        {this.renderViewTab()}
      </div>
    );
  }

  createNewView(){
    let view_settings_object = {
      model_name: '',
      project_name: TIMUR_CONFIG.project_name,
      tabs:{
        default:{
          description: '',
          name: 'default',
          index_order: 0,
          title: ''
        }
      }
    };

    this.setState({
      selected_model_name:'',
      view_settings_object,
      view_settings_string: JSON.stringify(
        view_settings_object.tabs,
        null,
        2
      )
    });

    this.toggleEdit();
  }

  render(){
    let view_items = [];
    if(this.props.views){
      view_items = Object.keys(this.props.views).map((key, index)=>({
        name: this.props.views[key].model_name,
        id: index,
      }));
    }

    let list_menu_props = {
      name: 'Settings',
      create: this.createNewView.bind(this),
      select: this.selectViewSetting.bind(this),
      items: view_items
    };

    return(
      <div className='settings-view-group'>

        <div className='left-column-group'>

          {list_menu_props && <ListMenu {...list_menu_props} />}
        </div>
        <div className='right-column-group'>

          {this.renderRightColumnGroup()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  if(state.timur.views === undefined) return {};
  return {views: state.timur.views};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestViewSettings: ()=>{
      dispatch(requestViewSettings());
    },
    
    updateViewSettings: (model_obj)=>{
      dispatch(updateViewSettings(model_obj));
    },

    deleteViewSettings: (model_obj)=>{
      dispatch(deleteViewSettings(model_obj));
    },
  };
};

export const SettingsViewContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsView);
