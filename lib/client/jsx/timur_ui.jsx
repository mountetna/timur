import * as React from 'react';
import {connect} from 'react-redux';
import { findRoute, setRoutes } from 'etna-js/dispatchers/router';

import { ThemeProvider } from '@material-ui/core/styles';

// Components.
import Manifests from './components/manifest/manifests';
import Browser from './components/browser/browser';
import Plotter from './components/plotter/plotter';
import RootView from 'etna-js/components/RootView';
import TimurNav from './components/timur_nav';
import Messages from 'etna-js/components/messages';
import ViewEditor from './components/view_editor/view_editor';

import {showMessages} from 'etna-js/actions/message_actions';
import {updateLocation} from 'etna-js/actions/location_actions';

import ModelMap from './components/model_map';
import Search from './components/search/search';
import {selectUser} from 'etna-js/selectors/user-selector';
import {ModalDialogContainer} from 'etna-js/components/ModalDialogContainer';
import {Notifications} from 'etna-js/components/Notifications';
import QueryPage from './components/query/query_page';

import { createEtnaTheme } from 'etna-js/style/theme';

const theme = createEtnaTheme("goldenrod", "#066306");

const ROUTES = [
  {
    template: '',
    component: RootView,
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
  {
    name: 'views',
    template: ':project_name/views',
    component: ViewEditor,
    mode: 'view_editor'
  },
  {
    name: 'curr_view',
    template: ':project_name/view/:view_id',
    component: ViewEditor,
    mode: 'view_editor'
  },
  {
    name: 'query',
    template: ':project_name/query',
    component: QueryPage,
    mode: 'query'
  }
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

    let { route, params } = findRoute(location, ROUTES);
    let Component;
    let mode;

    if (!route) {
      showMessages(['### You have lost your way: Path Invalid.']);
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

    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <ModalDialogContainer>
            <div id="ui-container">
              <Notifications/>
              <TimurNav environment={environment} mode={mode}/>
              <Messages/>
              <Component key={key} {...params} />
            </div>
          </ModalDialogContainer>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default connect(
  (state) => ({ location: state.location, user: selectUser(state) }),
  { showMessages, updateLocation }
)(TimurUI);
