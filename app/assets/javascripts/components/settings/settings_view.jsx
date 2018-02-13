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
      str_selected_view_settings_tab: '',
      selected_model: null,
      selected_view_settings: '',
      is_editing: false,
      page_status: '', 
      props_views_key: ''
    };
  }
  
  componentDidMount(){
    this.props.fetchViewSettings();
  }

  cloneView(selected_model){
    
    return JSON.parse(JSON.stringify(this.props.views.views[selected_model]));
  }

  stringifyViewTab(selected_model){

    return JSON.stringify(this.props.views.views[selected_model].tabs, null, 2);
  }

  updateField(property){
    return (event)=>{

      let {str_selected_view_settings_tab} = this.state;
      switch(property) {
        case 'tabs': 
          this.setState({str_selected_view_settings_tab: event.target.value});
          break;
        default:
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
        label: ' SAVE'
      },
      {
        click: this.cancelEdit.bind(this),
        icon: 'ban',
        label: ' CANCEL'
      }
    ].filter(button=>button);
  }

  saveEdit() {
    let {selected_view_settings, str_selected_view_settings_tab, selected_model} = this.state;

    try {
      selected_view_settings.tabs = JSON.parse(str_selected_view_settings_tab);
      this.setState({selected_view_settings});
    } 
    catch(e) {
      alert(e); // error in the above string (in this case, yes)!
      return;
    }
    
    this.props.updateEditViewSettings(selected_model, selected_view_settings);
  }

  cancelEdit(){

    // Reset the vuew
    this.setState({
      selected_view_settings: this.cloneView(this.state.selected_model),
      str_selected_view_settings_tab: this.stringifyViewTab(this.state.selected_model),
      page_status: ''
    });

    // Turn of the editing mode.
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
    let tab_code = this.state.str_selected_view_settings_tab;
    let tabs_attributes = {

      className: `${disabled} settings-view-tab-group`,
      value: tab_code,
      onChange: this.updateField('tabs'),
      disabled
    };
    return(
      <div className='settings-view-inspector-group'>
        
        <textarea {...tabs_attributes}></textarea>
      </div>
    );
  }

  rendeRightColumnGroup() {

    let { selected_view_settings, is_editing, page_status } = this.state;
    let disabled = (!is_editing) ? 'disabled' : '';

    let input_props = {
      className: 'disabled settings-view-model-title-input',
      value: selected_view_settings.model_name,
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
          </div>
          <br />
        </div>
        { this.renderViewTab() }
      </div>
    );
  }

  render(){
    let list_menu_props;
    let { selected_model } = this.state;
  
    if(this.props.views) {

      let {views} = this.props.views;
      let view_items = Object.keys(views).map((key, index) => ({ 
        name: views[key].model_name, 
        id: index,  
        class_name: 'left-column-selection-btn' 
      }));

      list_menu_props = {
        name: 'Settings',
        create: function() {},
        select: (id)=>{ 
          this.setState({
            selected_model: view_items[id].name,
            selected_view_settings: this.cloneView(view_items[id].name),
            str_selected_view_settings_tab: this.stringifyViewTab(view_items[id].name)
          });
        },
        items: view_items,
      };
    }

    return(
      <div className='settings-view-group'>

        <div className='left-column-group'>

          { list_menu_props && <ListMenu {...list_menu_props} /> }
        </div>
        <div className='right-column-group'>

          { selected_model && this.rendeRightColumnGroup()}
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
