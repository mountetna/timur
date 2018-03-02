// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import {addTokenUser} from '../../actions/token_user_actions';

export class SettingsUser extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.fetchUserSettings();
  }
  
  render(){

    return (this.props.tokenUser &&
      <pre>{JSON.stringify(this.props.tokenUser, null, 2)}</pre>);
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  if(state.tokenUser === undefined) return {};
  return {tokenUser: state.tokenUser};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchUserSettings: ()=>{
      dispatch(addTokenUser());
    }
  };
};

export const SettingsUserContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsUser);
