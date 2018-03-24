// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import {IdentifierSearchContainer as IdentifierSearch} from './identifier_search';


export class TimurRootNav extends React.Component{

  render() {
    let login_path = Routes.login_path();
    let login = this.props.user || <a href={ login_path}>Login</a>;


    return <div id='header'>
              <div id='logo'>
              </div>
              <div id='help_float'>
              </div>
              <div id='heading'>
              </div>
              <div id='nav'>
                <IdentifierSearch/>
                <div id='login'>
                  { login }
                </div>
              </div>
           </div>
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return ()=>{};
};

export const TimurRootNavContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TimurRootNav);