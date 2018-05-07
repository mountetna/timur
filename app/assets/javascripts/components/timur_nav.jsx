// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as TimurActions from '../actions/timur_actions';

import {IdentifierSearchContainer as IdentifierSearch} from './identifier_search';
import {HelpContainer as Help} from './help';

export class TimurNav extends React.Component{
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
    let tabs = {
      browse: Routes.browse_path(TIMUR_CONFIG.project_name),
      search: Routes.search_path(TIMUR_CONFIG.project_name),
      map: Routes.map_path(TIMUR_CONFIG.project_name),
      manifests: Routes.manifests_path(TIMUR_CONFIG.project_name),
      plots: Routes.plots_path(TIMUR_CONFIG.project_name)
    };

    let login = this.props.user;
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
                   <a href={ Routes.activity_path(TIMUR_CONFIG.project_name) }>Activity</a>
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

const mapStateToProps = (state = {}, own_props)=>{
  return {
    helpShown: state.timur.help_shown,
    exchanges: state.exchanges
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
