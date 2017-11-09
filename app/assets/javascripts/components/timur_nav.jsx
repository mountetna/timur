import IdentifierSearch from './identifier_search';
import Help from './help';
import { connect } from 'react-redux';

import { toggleConfig } from '../actions/timur_actions'
import React, { Component } from 'react'

class TimurNav extends Component {
  renderHalo() {
    return <div className='halo'>
      <svg>
        <circle r='25px' cx='35' cy='35'/>
        {
          Array(36).fill().map((_,i) => {
            let deg = i * 10;
            let rad = i % 2 == 0 ? 42 : 32;
            let x = (r) => Math.cos(Math.PI * deg / 180) * r + 35;
            let y = (r) => Math.sin(Math.PI * deg / 180) * r + 35;
            return <path
              className={ i%2==0 ? 'long' : 'short'}
              key={i}
              d={ `M ${x(rad)}, ${y(rad) } L ${x(25)}, ${y(25)}` }/>
          })
        }
      </svg>
    </div>
  }

  render() {
    let login_path = Routes.login_path();

    let tabs = {
      browse: Routes.browse_path(PROJECT_NAME),
      search: Routes.search_path(PROJECT_NAME),
      map: Routes.map_path(PROJECT_NAME),
      manifests: Routes.manifests_path(PROJECT_NAME),
      plots: Routes.plots_path(PROJECT_NAME)
    };

    let login = this.props.user || <a href={ login_path}>Login</a>;
    var heading;
    var logo_id;

    if (this.props.environment == 'development') {
      heading = <span>Timur Development</span>;
      logo_id = 'dev';
    }
    else {
      heading = <span>Timur <b>:</b> Data Browser</span>;
      logo_id = 'normal';
    }

    return <div id='header'>
             <div id='logo'>
               <a href='/'>
                 <div id={ logo_id }
                   className={ Object.keys(this.props.exchanges).length > 0 ? 'throb' : null }
                 >
                   <div className='image'/>
                   {
                     this.renderHalo()
                   }
                 </div>
               </a>
             </div>
             <div id='help_float'>
                 <Help info='timur'/>
              </div>
             <div id='heading'>
               { heading }
             </div>
             <div id='nav'>
               {
                 Object.keys(tabs).map((name) =>
                   <div key={ name } 
                     className={ 'nav_tab' + (this.props.mode == name ? ' selected' : '') }>
                       <a href={ tabs[name] }> { name } </a>
                     </div>
                 )
               }
               {
                 this.props.can_edit ?
                 <div className='nav_tab'>
                   <a href={ Routes.activity_path(PROJECT_NAME) }>Activity</a>
                 </div>
                 : null
               }
               <div className='nav_tab'>
                 <a onClick={ (e) => this.props.toggleConfig('help_shown') }>
                 {
                   this.props.helpShown ? 'Hide Help' : 'Help'
                 }
                 </a>
               </div>
               <IdentifierSearch/>
               <div id='login'>
                 { login }
               </div>
             </div>
           </div>
  }
}

export default connect(
  (state) => ({
    helpShown: state.timur.help_shown,
    exchanges: state.exchanges
  }),
  {
    toggleConfig
  }
)(TimurNav)
