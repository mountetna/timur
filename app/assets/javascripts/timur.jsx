import Timur from './components/timur';
import * as ReactDOM from 'react-dom';
import React from 'react';

class TimurApp {
  constructor(props,id) {
    ReactDOM.render(
      <Timur { ...props }/>,
      document.getElementById(id)
    );
  }
}

window.TimurApp = TimurApp;
