// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class TabBar extends React.Component{
  constructor(props){
    super(props);
    this.props.initialized(this.constructor.name);
  }

  formatName(name){
    return name.replace(/_/, ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  renderTabs(){
    let self = this;
    let {view, current_tab_index, revised, clickTab} = this.props;

    let tabs = Object.keys(view.tabs).map((tab_name, index)=>{

      // Render a selected tab.
      if(current_tab_index == view.tabs[tab_name].index_order){
        return(
          <div className='selected tab' key={index}>

            {self.formatName(tab_name)}
          </div>
        );
      }

      // Render a non selected tab.
      let tab_props = {
        key: tab_name,
        className: revised[tab_name] ? 'revised tab' : 'tab',
        onClick: function(event){
          clickTab(view.tabs[tab_name].index_order);
        }
      };

      return <div {...tab_props}>{self.formatName(tab_name)}</div>;
    });

    return tabs;
  }

  render(){

    let {tabs} = this.props.view;

    // Don't bother showing only one tab.
    if (Object.keys(tabs).length == 1) return <div style={{display: 'none'}} />

    return(
      <div className='browser-tab-bar'>

        <div className='spacer1' />
        {this.renderTabs()}
        <div className='spacer2' />
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  let revised = {};
  let {view, mode, revision} = own_props;

  if(mode == 'edit' && revision){
    //do nothing yet.
  }

  return {...own_props, revised};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    initialized: (component)=>{
      dispatch({
        type: 'INITIALIZED',
        component
      });
    }
  };
};

export const TabBarContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TabBar);
