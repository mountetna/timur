import * as React from 'react';
import { connect } from 'react-redux';

// Components.
import {ManifestsContainer as Manifests} from './components/manifest/manifests';
import {BrowserContainer as Browser} from './components/browser/browser';
import {PlotterContainer as Plotter} from './components/plotter/plotter';
import {HomePageContainer as HomePage} from './components/home_page';
import {TimurNavContainer as TimurNav} from './components/timur_nav';
import {MessagesContainer as Messages} from './components/messages';

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
    tab: 'home'
  },
  {
    template: ':project_name/browse/',
    component: Browser,
    tab: 'browse'
  },
  {
    template: ':project_name/browse/:model_name/*record_name',
    component: Browser,
    tab: 'browse'
  },
  {
    template: ':project_name/search',
    component: Search,
    tab: 'search'
  },
  {
    template: ':project_name/map',
    component: ModelMap,
    tab: 'map'
  },
  {
    template: ':project_name/manifests',
    component: Manifests,
    tab: 'manifests'
  },
  {
    template: ':project_name/manifest/:manifest_id',
    component: Manifests,
    tab: 'manifests'
  },
  {
    template: ':project_name/plots',
    component: Plotter,
    tab: 'plots'
  },
];


const NAMED_PARAM=/:([\w]+)/g;
const GLOB_PARAM=/\*([\w]+)$/g;
const ROUTE_PART=/(:[\w]+|\*[\w]+$)/g;

const UNSAFE=/[^\-_.!~*'()a-zA-Z\d;\/?:@&=+$,]/g;

const route_regexp = (template) => (
  new RegExp(
    '^/' +
    template.
      // any :params match separator-free strings
      replace(NAMED_PARAM, '([^\\.\\/\\?]+)').
      // any *params match arbitrary strings
      replace(GLOB_PARAM, '(.+)').
      // ignore any trailing slashes in the route
      replace(/\/$/, '') +
      // trailing slashes in the path can be ignored
    '/?' + '$'
  )
);

const route_parts = (template) => {
  let parts = []
  // this does not replace, merely uses replace() to scan
  template.replace(
    ROUTE_PART,
    (part) => parts.push(part.replace(/^./,''))
  );
  return parts;
};

ROUTES.forEach(route => {
  route.regexp = route_regexp(route.template);
  route.parts = route_parts(route.template);
});

class TimurRouter extends React.Component {
  constructor(props) {
    super(props);

    window.onpopstate = this.updateLocation.bind(this);
  }

  updateLocation() {
    let { updateLocation } = this.props;
    updateLocation(location.pathname);
  }

  render() {
    let { location, showMessages, environment } = this.props;

    let route = ROUTES.find(route => location.match(route.regexp));

    if (!route) {
      showMessages([ '### You have lost your way: Path Invalid.' ]);
      return null;
    }

    let [ _, ...values ] = location.match(route.regexp);

    let params = route.parts.reduce(
      (map, key, index) => {
        map[key] = values[index];
        return map;
      },
      {}
    );

    let Component = route.component;

    // this key allows us to remount the component when the params change
    let key = JSON.stringify(params);

    return <div id='ui-container'>
      <TimurNav environment={ environment } mode={ route.tab }/>
      <Messages />
      <Component key={key} {...params}/>
    </div>
  }
}

export default connect(
  ({location}) => ({ location }),
  { showMessages, updateLocation }
)(TimurRouter);
