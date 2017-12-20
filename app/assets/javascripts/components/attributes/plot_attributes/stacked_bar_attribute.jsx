// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class StackedBarAttribute extends React.Component{
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

export const StackedBarAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(StackedBarAttribute);
