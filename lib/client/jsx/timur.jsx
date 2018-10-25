// Framework Libraries.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import TimurRouter from './timur_router';
import {timurStore} from './timur_store';
import {addTokenUser} from './actions/timur_actions'

class TimurApplication{
  constructor(props, container_id){
    // create the store
    this.createStore();

    // add user info from the token to the store
    this.store.dispatch(addTokenUser());

    // create the base component
    this.createUI(props, container_id);
  }

  createStore(){
    this.store = timurStore();
  }

  createUI({environment}, container_id) {
    ReactDOM.render(
      <Provider store={this.store}>
        <TimurRouter
          environment={environment}
          path={ decodeURI(window.location.pathname) }>
        </TimurRouter>
      </Provider>,
      document.getElementById(container_id)
    );
  }
}

window.TimurApp = TimurApplication;
