// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import ListMenu from '../list_menu';
import ButtonBar from '../button_bar';
import {requestViewSettings, updateViewSettings} from '../../actions/timur_actions';
import { selectConsignment } from '../../selectors/consignment_selector';

export class SettingsView extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      view_settings_string: '',
      view_settings_object: null,
      selected_model_name: null,
      is_editing: false,
      page_status: '',
      parse_error_message: ''
    };
  }
  
  componentDidMount(){
    this.props.fetchViewSettings();
  }

  cloneView(selected_model_name){
    
    return JSON.parse(JSON.stringify(this.props.views.views[selected_model_name]));
  }

  stringifyViewTab(selected_model_name){

    return JSON.stringify(this.props.views.views[selected_model_name].tabs, null, 2);
  }

  updateField(property){
    return (event)=>{

      let {view_settings_string} = this.state;
      this.setState({view_settings_string: event.target.value});

      try {
        JSON.parse(event.target.value);
        this.setState({parse_error_message: ''});
      }
      catch(e) 
      {
        this.setState({parse_error_message: e.message});
       return;
      }
    };
  }

  editableButtons(){

    let {} = this.props;
    return [
      {
        click: () => {},
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

  saveEdit() {
    let {
      view_settings_object, 
      view_settings_string, 
      selected_model_name
    } = this.state;

    view_settings_object.tabs = JSON.parse(view_settings_string);
    this.setState({view_settings_object}); 
    this.props.updateEditViewSettings(selected_model_name, view_settings_object);
  }

  cancelEdit(){

    // Reset the view.
    this.setState({
      view_settings_object: this.cloneView(this.state.selected_model_name),
      view_settings_string: this.stringifyViewTab(this.state.selected_model_name),
      page_status: '',
      parse_error_message: ''
    });

    // Turn off the editing mode.
    this.toggleEdit();
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
      onChange: this.updateField(),
      disabled
    };
    return(
      <div className='settings-view-inspector-group'>
        
        <textarea {...tabs_attributes}></textarea>
      </div>
    );
  }

  rendeRightColumnGroup() {

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
      readOnly: 'readOnly'
    };

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

  render(){
    let list_menu_props;
    let {selected_model_name} = this.state;
  
    if(this.props.views) {

      let {views} = this.props.views;
      let view_items = Object.keys(views).map((key, index) => ({
        name: views[key].model_name,
        id: index,
      }));

      list_menu_props = {
        name: 'Settings',
        create: function() {},
        select: (id)=>{ 
          this.setState({
            selected_model_name: view_items[id].name,
            view_settings_object: this.cloneView(view_items[id].name),
            view_settings_string: this.stringifyViewTab(view_items[id].name)
          });
        },
        items: view_items,
      };
    }

    return(
      <div className='settings-view-group'>

        <div className='left-column-group'>

          {list_menu_props && <ListMenu {...list_menu_props} /> }
        </div>
        <div className='right-column-group'>

          {selected_model_name && this.rendeRightColumnGroup()}
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
    fetchViewSettings: ()=>{
      dispatch(requestViewSettings());
    },
    
    updateEditViewSettings: (model_name, model_obj)=>{
      dispatch(updateViewSettings(model_name, model_obj));
    },
  };
};

export const SettingsViewContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsView);
