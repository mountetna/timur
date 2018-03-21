// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import * as MessageActions from '../actions/message_actions';

export class Noauth extends React.Component{
  componentDidMount() {
    this.props.message([
      "####",
      "Alas,", 
      this.props.user, 
      "--",
      "Though you seek to enter, you are *Unauthorized*." 
    ].join(" "))
  }
  render() {
    return <div className="noauth"/>
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return state;
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    message: function(message) {
      dispatch(MessageActions.showMessages([message]))
    }
  };
};

export const NoAuthContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Noauth);
