// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import ListMenu from '../list_menu';
import ButtonBar from '../button_bar';
import {requestViewSettings} from '../../actions/timur_actions';

export class SettingsView extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      selected_model: null,
      is_editing: false
    };
  }

  componentDidMount(){
    this.props.fetchViewSettings();
  }

  updateField(field_name){
    return (event)=>{
      let manifest = this.state.manifest;
      manifest[field_name] = event.target.value;
      this.setState({manifest});
    }
  }

  // This is the main panel in which we inspect view code.
  renderViewInspector(model_name){

    if(!this.props.views) return null;
    let view_code = this.props.views.views[model_name];
    return(
      <div className='view-setting-inpector-group'>
        
        {this.renderTabEntries(view_code)}
      </div>
    );
  }

  // This renders individual tabs for a project in the inpsector.
  renderTabEntries(view_code){

    let tabs = [];
    let index = 0;

    for(let tab_name in view_code.tabs){

      let tab = (
        <div className='view-setting-tab-group' key={tab_name+'-'+index}>

          <div className='view-setting-tab-header'>

            {'TAB NAME : '+tab_name}
          </div>
          {this.renderTabPanes(view_code.tabs[tab_name])}
        </div>
      );
      tabs.push(tab);

      ++index;
    }

    return tabs;
  }

    // This renders the pane code for a tab.
    renderTabPanes(pane_code){

      let panes = [];
      let index = 0;
  
      for(let pane_name in pane_code.panes){
  
        let pane_props = {
          className: 'view-setting-pane',
          value: JSON.stringify(pane_code.panes[pane_name], null, 2),
          onChange: (evt)=>{
            console.log(evt);
          }
        };
  
        panes.push(
          <div className='view-setting-pane-group' key={pane_name+'-'+index}>
            
            <div className='view-setting-pane-header'>
  
              {'PANE NAME : '+pane_name}
            </div>
            <textarea {...pane_props}></textarea>
          </div>
        );
      }
      return panes;
    }

  render(){
    let list_menu_props;
    let { is_editing } = this.state;
    let disabled = (!is_editing) ? 'disabled' : '';
  
    if(this.props.views) {

      let {views} = this.props.views;
      let view_items = Object.keys(views).map((key, index) => ({ 
        name: key, 
        id: index,  
        class_name: 'left-column-selection-btn' 
      }));

      list_menu_props = {
        name: 'Settings',
        create: function() {},
        select: (id)=>{ 
          this.setState({selected_model: view_items[id].name});
        },
        items: view_items,
      };
    }

    let input_props = {
      className: `${disabled} manifest-form-title-input`,
      value: this.state.selected_model,
      type: 'text',
      disabled
    };

    return(
      <div className='settings-group'>
        <div className='manifest-form-header'>

          <div className='manifest-form-title'>

            { 'NAME: '}
            <input {...input_props} />
            
            <span style={{float: 'right'}}>

              {'page_status'}
            </span>
          </div>
          <br />
        </div>

        <div className='left-column-group'>

          <div className='left-column-menu-group'>

            { list_menu_props && <ListMenu {...list_menu_props} /> }
          </div>
        </div>
        <div className='right-column-group'>

          { this.state.selected_model && this.renderViewInspector(this.state.selected_model) }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  if(state.timur.views === undefined) return {};
  return {...state, views: state.timur.views};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchViewSettings: ()=>{
      dispatch(requestViewSettings());
    }
  };
};

export const SettingsViewContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsView);
