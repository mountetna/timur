import * as React from 'react';
import { connect } from 'react-redux';
import { findRoute, setRoutes } from './router';

// Components.
import Manifests from './components/manifest/manifests';
import Browser from './components/browser/browser';
import Plotter from './components/plotter/plotter';
import {HomePageContainer as HomePage} from './components/home_page';
import TimurNav from './components/timur_nav';
import Messages from './components/messages';

import { showMessages } from './actions/message_actions';
import { updateLocation } from './actions/location_actions';

import ModelMap from './components/model_map';
import Search from './components/search/search';
import Activity from './components/activity';
import Noauth from './components/noauth';
import { selectUser } from './selectors/user_selector';

const ROUTES = [
  {
    template: '',
    component: HomePage,
    mode: 'home'
  },
  {
    template: ':project_name/',
    component: Browser,
    mode: 'browse'
  },
  {
    name: 'browse',
    template: ':project_name/browse/',
    component: Browser,
    mode: 'browse'
  },
  {
    name: 'browse_model',
    template: ':project_name/browse/:model_name/*record_name',
    component: Browser,
    mode: 'browse'
  },
  {
    name: 'browse_tab',
    template: ':project_name/browse/:model_name/*record_name#:tab_name',
    component: Browser,
    mode: 'browse'
  },
  {
    name: 'search',
    template: ':project_name/search',
    component: Search,
    mode: 'search'
  },
  {
    name: 'map',
    template: ':project_name/map',
    component: ModelMap,
    mode: 'map'
  },
  {
    name: 'manifests',
    template: ':project_name/manifests',
    component: Manifests,
    mode: 'manifests'
  },
  {
    name: 'manifest',
    template: ':project_name/manifest/:manifest_id',
    component: Manifests,
    mode: 'manifests'
  },
  {
    name: 'plots',
    template: ':project_name/plots',
    component: Plotter,
    mode: 'plots'
  },
  {
    name: 'plot',
    template: ':project_name/plot/:plot_id',
    component: Plotter,
    mode: 'plots'
  },
];

setRoutes(ROUTES);

const Empty = () => <div/>;

class TimurUI extends React.Component {
  constructor(props) {
    super(props);

    window.onpopstate = this.updateLocation.bind(this);
  }

  updateLocation() {
    let { updateLocation } = this.props;
    updateLocation(location);
  }

  render() {
    let { location, showMessages, environment, user } = this.props;

    let { route, params }  = findRoute(location,ROUTES);
    let Component;
    let mode;

    if (!route) {
      showMessages([ '### You have lost your way: Path Invalid.' ]);
      mode = 'home';
      Component = Empty;
    } else {
      mode = route.mode;
      Component = route.component;
    }

    // wait until the user loads to avoid race conditions
    if (!user) return null;

    // this key allows us to remount the component when the params change
    let key = JSON.stringify(params);

    return <div id='ui-container'>
      <TimurNav environment={ environment } mode={ mode }/>
      <Messages />
      <Component key={key} {...params}/>
    </div>
  }
}

export default connect(
  (state) => ({ location: state.location, user: selectUser(state) }),
  { showMessages, updateLocation }
)(TimurUI);
