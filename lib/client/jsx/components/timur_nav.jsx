// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import IdentifierSearch from './identifier_search';
import Link from './link';
import { selectUser } from '../selectors/user_selector';

const Halo = ({radius}) =>
  <div className='halo'>
    <svg>
      <circle r={`${radius*0.7}px`} cx={`${radius}px`} cy={`${radius}px`}/>
      {
        Array(36).fill().map((_,i) => {
          let deg = i * 10;
          let rad = radius * (i % 2 == 0 ? 1.0 : 0.9);
          let x = (r) => Math.cos(Math.PI * deg / 180) * r + radius;
          let y = (r) => Math.sin(Math.PI * deg / 180) * r + radius;
          return <path
            className={ i%2==0 ? 'long' : 'short'}
            key={i}
            d={ `M ${x(rad)}, ${y(rad) } L ${x(radius*0.7)}, ${y(radius*0.7)}` }/>
        })
      }
    </svg>
  </div>;

const Logo = ({exchanges, logo_id}) =>
  <div id='logo'>
    <a href='/'>
      <div id={logo_id} className={Object.keys(exchanges).length > 0 ? 'throb' : null }>

        <div className='image'>
        </div>
        <Halo radius={27.5}/>
      </div>
    </a>
  </div>;

const ICONS = {
  administrator: 'user-astronaut',
  editor: 'user-edit',
  viewer: 'user'
};

const Login = ({user}) => {
  let {first, last, permissions} = user;

  let project_perm = permissions.find(({project_name}) => project_name == TIMUR_CONFIG.project_name);
  let role = project_perm ? project_perm.role : '';
  if (!user) return null;
  return <div id='login'>
      { first } { last }
      <i className={ `fa fa-${ICONS[role]}` } title={role}/>
  </div>;
}

class TimurNav extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  renderTabs() {
    let { mode } = this.props;
    let tabs = {
      browse: Routes.browse_path(TIMUR_CONFIG.project_name),
      search: Routes.search_path(TIMUR_CONFIG.project_name),
      map: Routes.map_path(TIMUR_CONFIG.project_name),
      manifests: Routes.manifests_path(TIMUR_CONFIG.project_name),
      plots: Routes.plots_path(TIMUR_CONFIG.project_name),
      help: 'https://github.com/mountetna/timur/wiki'
    };

    return(
      Object.keys(tabs).map((tab_name)=>
       <div key={tab_name} className={ `nav_tab ${mode == tab_name ? 'selected' : ''}` }>
         <Link link={tabs[tab_name]}>{tab_name}</Link>
       </div>
     )
    );
  }


  render(){

    let { exchanges, mode, environment, user } = this.props;
    let isDev = false; //environment == 'development';
    let heading = <span>{'Timur'}<b>{' : '}</b>{
       isDev ? 'Development' : 'Data Browser'
    }</span>;
    let logo_id = isDev ? 'dev' : 'normal';

    return(
      <div id='header'>
        <Logo exchanges={exchanges} logo_id={logo_id}/>
        {mode !== 'home' && <IdentifierSearch />}
        <div id='nav'>
          {mode !== 'home' && this.renderTabs()}
        </div>
        <Login user={user}/>
      </div>
    );
  }
}

export default connect(
  (state) => ({exchanges: state.exchanges, user: selectUser(state)})
)(TimurNav);
