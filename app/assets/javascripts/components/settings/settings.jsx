// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {SettingsViewContainer as SettingsView} from './settings_view';
import {SettingsUserContainer as SettingsUser} from './settings_user';

// Main component for viewing/editing settings.
export class Settings extends React.Component{
  render(){
    switch(this.props.settings_page){
      case 'view':
        return <SettingsView />;
      case 'user':
        return <SettingsUser />;
      default:
        return <div>{'There are no settings that match your query.'}</div>;
    }
  }
}
