import * as React from 'react';
import { connect } from 'react-redux';

// Components.
import Manifests from './components/manifest/manifests';
import Browser from './components/browser/browser';
import Plotter from './components/plotter_d3_v5/plotter';
import {HomePageContainer as HomePage} from './components/home_page';
import TimurNav from './components/timur_nav';
import Messages from './components/messages';

import { showMessages } from './actions/message_actions';
import { updateLocation } from './actions/location_actions';

import ModelMap from './components/model_map';
import Search from './components/search/search';
import Activity from './components/activity';
import Noauth from './components/noauth';

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


const NAMED_PARAM=/:([\w]+)/g;
const GLOB_PARAM=/\*([\w]+)$/g;
const ROUTE_PART=/(:[\w]+|\*[\w]+$)/g;

const UNSAFE=/[^\-_.!~*'()a-zA-Z\d;\/?:@&=+$,]/g;

const route_regexp = (template) => template.
  // any :params match separator-free strings
  replace(NAMED_PARAM, '([^\\.\\/\\?\\#]+)').
  // any *params match arbitrary strings
  replace(GLOB_PARAM, '(.+?)').
  // ignore any trailing slashes in the route
  replace(/\/$/, '');

const routeParts = (template) => {
  let parts = [];
  // this does not replace, merely uses replace() to scan
  if (template) template.replace(
    ROUTE_PART,
    (part) => parts.push(part.replace(/^./,''))
  );
  return parts;
};

const routePath = (template, params) => {
  let index = 0;
  return '/' + template.replace(
    ROUTE_PART,
    part => params[index++]
  );
};

const matchRoute = ({ path, hash }, route) => (
  // match the route part
  path.match(route.path_regexp) && (!hash || (route.hash_regexp && hash.match(route.hash_regexp)))
);

const routeParams = ({path,hash}, route) => {
  let [ _, ...values ] = decodeURIComponent(path).match(route.path_regexp);

  if (hash) {
    let [ _, ...hash_values ] = hash.match(route.hash_regexp);
    values = values.concat(hash_values);
  }

  let params = route.parts.reduce(
    (map, key, index) => {
      map[key] = values[index];
      return map;
    },
    {}
  );
  return params;
}


window.Routes = window.Routes || {};

ROUTES.forEach(route => {
  let [ path, hash ] = route.template.split(/#/);
  route.path_regexp = new RegExp(`^/${ route_regexp(path) }/?$`);
  route.hash_regexp = hash ? new RegExp(`^#${route_regexp(hash)}$`) : null;
  route.parts = routeParts(path).concat(routeParts(hash));
  if (route.name) {
    window.Routes[`${route.name}_path`] = (...params) =>
      routePath(route.template, params);
  }
});

const Empty = () => <div/>;

class TimurRouter extends React.Component {
  constructor(props) {
    super(props);

    window.onpopstate = this.updateLocation.bind(this);
  }

  updateLocation() {
    let { updateLocation } = this.props;
    updateLocation(location);
  }

  render() {
    let { location, showMessages, environment } = this.props;

    let route = ROUTES.find(route => matchRoute(location,route));
    let params = {};
    let Component;
    let mode;

    if (!route) {
      showMessages([ '### You have lost your way: Path Invalid.' ]);
      mode = 'home';
      Component = Empty;
    } else {
      mode = route.mode;
      Component = route.component;
      params = routeParams(location, route);
    }

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
  ({location}) => ({ location }),
  { showMessages, updateLocation }
)(TimurRouter);
