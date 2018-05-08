// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import * as TimurActions from '../../actions/timur_actions';

export class SettingsUser extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.fetchUserSettings();
  }
  
  render(){
    if(this.props.token_user){
      return <pre>{JSON.stringify(this.props.token_user, null, 2)}</pre>;
    }
    else{
      return null;
    }
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  if(state.timur.user === undefined) return {};
  return {token_user: state.timur.user};
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchUserSettings: ()=>{
      dispatch(TimurActions.addTokenUser());
    }
  };
};

export const SettingsUserContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsUser);
