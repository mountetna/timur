// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {HelpContainer as Help} from './help';
import * as TimurActions from '../actions/timur_actions';

export class TimurNav extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  renderTabs(){
    var tabs = {
      PLOT: Routes.plots_path(PROJECT_NAME),
      MANIFEST: Routes.manifests_path(PROJECT_NAME),
      MAP: Routes.map_path(PROJECT_NAME),
      SEARCH: Routes.search_path(PROJECT_NAME),
      BROWSE: Routes.browse_path(PROJECT_NAME),
    };

    return (
      Object.keys(tabs).map(name=>{
        const tab_props = {
          className: 'nav-menu-btn',
          key: Math.random(),
          href: `${window.location.origin}${tabs[name]}/${this.props.project}`
        };

        return <a {...tab_props}>{name}</a>;
      })
    );
  }

  renderNavPath(){
    //remove all leading and trailing slashes
    let str = window.location.pathname.replace(/^\/+|\/+$/g, '')

    str = str.replace( /\/|%20/g, (match, i) =>{
      return (match=='/')?' > ': ' ';
    })
    return str.toUpperCase();
  }
  
  render() {

    let activity_props = {
      className: 'nav-menu-btn',
      href: Routes.activity_path(PROJECT_NAME)
    }

    let help_props = {
      className: 'nav-menu-btn',
      onClick: (e) => this.props.toggleConfig('help_shown') 
    }

    return (
      <div>
        <div id='header-group'>

        <div id='title-menu'>

          <button className='title-menu-btn'>

            {'Timur'}
            <br />
            <span className='title-menu-btn-sub'>

              {'DATA BROWSER'}
            </span>
          </button>
          <img id='ucsf-logo' src='/images/ucsf_logo_dark.png' alt='' />
        </div>
        <div id='nav-menu'>

          {this.renderTabs()}
          {this.props.can_edit ? <a {...activity_props}>ACTIVITY</a>: null}
          <a {...help_props}>

            {this.props.helpShown ? 'HIDE HELP' : 'HELP'}
          </a>
        </div>
        <div className='logo-group'>

          <img src='/images/timur_logo_basic.png' alt='' />
        </div>
      </div>
    </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    project: state.timur.path ? state.timur.path.project : '',
    component: state.timur.path ? state.timur.path.component : '',
    helpShown: state.timur.help_shown,
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    toggleConfig: (text)=>{
      dispatch(TimurActions.toggleConfig(text));
    }
  };
};

export const TimurNavContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TimurNav);
