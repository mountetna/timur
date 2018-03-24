import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import * as TimurActions from '../../javascripts/actions/timur_actions';

export class Root extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.fetchPermissionsSettings();
  }
 
  render(){
    let project_props = null;

    if(this.props.token_permissions){
      return this.props.token_permissions.map((obj, index)=>{

        project_props = {
          className:'list-selection',
          key: index
        }
        return <button {...project_props}>{obj.project_name}</button>
      })
    }
    else{
      return null;
    }
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  if(state.timur.user === undefined) return {};
  return {token_permissions: state.timur.user.permissions};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchPermissionsSettings: ()=>{
      dispatch(TimurActions.addTokenUser());
    }
  };
};

export const RootContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);