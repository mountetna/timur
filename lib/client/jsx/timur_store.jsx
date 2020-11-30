import {combineReducers, createStore, applyMiddleware} from 'redux';

import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

// Reducers.
import magma from './reducers/magma_reducer';
import messages from './reducers/message_reducer';
import plots from './reducers/plots_reducer';
import views from './reducers/view_reducer';
import user from './reducers/user_reducer';
import search from './reducers/search_reducer';
import manifestsUI from './reducers/manifest_ui_reducer';
import manifests from './reducers/manifests_reducer';
import consignments from './reducers/consignments_reducer';
import exchanges from './reducers/exchanges_reducer';
import predicates from './reducers/predicates_reducer';
import location from './reducers/location_reducer';
import directory from './reducers/directory_reducer';
import janus from 'etna-js/reducers/janus-reducer';

import * as uploadActions from 'etna-js/upload/actions/upload_actions';

import asyncDispatcher from 'etna-js/dispatchers/async-dispatcher';
import workDispatcher from 'etna-js/dispatchers/work-dispatcher';

export const timurStore = () => {
  let reducers = combineReducers({
    magma,
    messages,
    plots,
    user,
    views,
    search,
    manifestsUI,
    manifests,
    consignments,
    exchanges,
    predicates,
    location,
    directory,
    janus
  });

  let middlewares = [
    thunk,
    asyncDispatcher({
      ...uploadActions
    }),
    workDispatcher()
  ];

  if (process.env.NODE_ENV != 'production')
    middlewares.push(createLogger({collapsed: true}));

  return createStore(reducers, {}, applyMiddleware(...middlewares));
};
