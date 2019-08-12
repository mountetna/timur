// Framework Libraries.
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import TimurUI from './timur_ui';
import {timurStore} from './timur_store';
import {addTokenUser} from './actions/user_actions'
import * as Cookies from './utils/cookies';

class TimurApplication{
  constructor(props, container_id){
    // create the store
    this.createStore();

    // add user info from the token to the store
    this.store.dispatch(
      {
        type: 'ADD_TOKEN_USER',
        token: Cookies.getItem(TIMUR_CONFIG.token_name)
      }
    );

    // create the base component
    this.createUI(props, container_id);
  }

  createStore(){
    this.store = timurStore();
  }

  createUI({environment}, container_id) {
    ReactDOM.render(
      <Provider store={this.store}>
        <TimurUI
          environment={environment}
          path={ decodeURI(window.location.pathname) }>
        </TimurUI>
      </Provider>,
      document.getElementById(container_id)
    );
  }
}

window.TimurApp = TimurApplication;
