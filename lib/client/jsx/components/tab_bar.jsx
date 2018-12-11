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
    let {view, current_tab, revised, onClick} = this.props;

    let tabs = Object.keys(view.tabs).map((tab_name, index)=>{
      let tab = view.tabs[tab_name];

      return(
        (current_tab == tab.name) ?
        // selected tab.
        <div className='selected tab' key={index}>
          {this.formatName(tab_name)}
        </div>
        :
        // non selected tab.
        <div className={ revised[tab_name] ? 'revised tab' : 'tab' }
          onClick= { (event) => onClick(tab.name) }
          key={index}>
          {this.formatName(tab_name)}
        </div>
      );
    });

    return tabs;
  }

  render(){
    let {tabs} = this.props.view;

    // Don't bother showing only one tab.
    if (Object.keys(tabs).length == 1) return <div style={{display: 'none'}} />

    return(
      <div className='tabbar'>

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
