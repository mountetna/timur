// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {SettingsViewContainer as SettingsView} from './settings_view';

// Main component for viewing/editing settings.
export class Settings extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    switch(this.props.settings_page){
      case 'view': 
        return <SettingsView />;
        return <div>{'There are no settings that match your query.'}</div>;
    }
  }
}
