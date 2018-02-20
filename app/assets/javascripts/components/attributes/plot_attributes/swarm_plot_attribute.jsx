// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class SwarmPlotAttribute extends React.Component{
  constructor(props){
    super(props);
    this.props.initialized(this.constructor.name);
  }

  render(){
    return(
      <div>

        {'Stacked Bar Attribute'}
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return state;
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    initialized: (component)=>{
      dispatch({
        type: 'INITIALIZED',
        component
      });
    }
  };
};

export const SwarmPlotAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SwarmPlotAttribute);
