// Framework Libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import BarGraph from '../plots/bar_graph';

// Module imports.
import {selectConsignment} from '../../selectors/consignment';

class BarGraphAttribute extends React.Component{
  constructor(props){
    super(props);
    this.props.initialized(this.constructor.name);
  }

  render(){

    let {attribute, data} = this.props;
    let bar_graph_props = {
      plot: {name: attribute.title, width: 500, height: 300},
      margin: {top: 10, right: 20, bottom: 90, left: 50},
      data
    };

    return(
      <div className='value'>

        {data[0] && <BarGraph {...bar_graph_props} />}
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{

  let consignment = selectConsignment(state, own_props.attribute.manifest_id);

  if(consignment){
    let data = consignment.data.map((label, value)=>{

      value = value.map((label, value)=>{
        return {label, value};
      });

      value = value.reduce((acc, curr)=>{
        return {
          ...acc,
          [curr.label]: curr.value
        };
      }, {});

      return value;
    });

    return {data};
  }
  
  return {data: []};
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

const BarGraphAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(BarGraphAttribute);

export default BarGraphAttributeContainer;
