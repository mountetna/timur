// Framework Libraries.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';

import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

// Reducers.
import magma from './reducers/magma_reducer';
import messages from './reducers/message_reducer';
import plots from './reducers/plots_reducer';
import timur from './reducers/timur_reducer';
import search from './reducers/search_reducer';
import manifestsUI from './reducers/manifest_ui_reducer';
import manifests from './reducers/manifests_reducer';
import consignments from './reducers/consignments_reducer';
import exchanges from './reducers/exchanges_reducer';
import predicates from './reducers/predicates_reducer';

// Components.
import {ManifestsContainer as Manifests} from './components/manifest/manifests';
import {BrowserContainer as Browser} from './components/browser/browser';
import {PlotterContainer as Plotter} from './components/plotter/plotter';
import {MessagesContainer as Messages} from './components/messages';
import {TimurNavContainer as TimurNav} from './components/timur_nav';

import ModelMap from './components/model_map';
import Search from './components/search/search';
import Activity from './components/activity';
import Noauth from './components/noauth';


class TimurApplication{
  constructor(initial_props, container_id){
    this.store = null;
    this.createStore();
    this.createUI(initial_props, container_id);
  }

  createStore(){

    let default_state = {
      consignments: {},
      exchanges: {},
      magma: {
        models: {},
        tables: {}
      },
      manifestsUI: {
        filter: null,
        selected: null
      },
      manifests: {},
      messages: [],
      plots: {
        plotsMap: {},
        selected: null,
        selectedPoints: []
      },
      predicates: {},
      search: {
        pages: {}
      },
      timur: {}
    };

    let reducers = Redux.combineReducers({
      magma,
      messages,
      plots,
      timur,
      search,
      manifestsUI,
      manifests,
      consignments,
      exchanges,
      predicates
    });

    let middlewares = [
      thunk
    ];

    // Apply the logging if we are not in production.
    //if(process.env.NODE_ENV != 'production') middlewares.push(createLogger());

    this.store = Redux.createStore(
      reducers,
      default_state,
      Redux.applyMiddleware(...middlewares)
    );
  }

  createComponent(props){
    switch(props.mode){
      case 'manifests':
        return <Manifests {...props} />;
        break;
      case 'browse':
        return <Browser {...props} />;
        break;
      case 'map':
        return <ModelMap />;
        break;
      case 'plots':
        return <Plotter {...props}/>;
        break;
      case 'search':
        return <Search  {...props} />; 
        break;
      case 'activity':
        return <Activity {...props} />;
        break;
      case 'noauth':
        return <Noauth {...props} />;
      default:
        return null;
    }
  }

  createUI(props, containr_id){
    let timur_nav_props = {
      user: props.user,
      can_edit: props.can_edit,
      mode: props.mode,
      environment: props.environment
    };

    ReactDOM.render(
      <Provider store={this.store}>

        <div id='ui-container'>

          <TimurNav {...timur_nav_props} />
          <Messages />
          {this.createComponent(props)}
        </div>
      </Provider>,
      document.getElementById(containr_id)
    );
  }
}

window.TimurApp = TimurApplication;
