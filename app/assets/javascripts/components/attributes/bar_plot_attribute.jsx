// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Module imports.
import {selectConsignment} from '../../selectors/consignment';

class BarPlotAttribute extends React.Component{
  constructor(props){
    super(props);
    this.props.initialized(this.constructor.name);
  }

  render(){
    return(
      <div>

        {'BarPlotAttribute Temp'}
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{

  let consignment = selectConsignment(state, own_props.attribute.manifest_id);
  let bars = [];

  if (consignment && consignment.bars) {
    bars = consignment.bars.map((_, bar, i) => ({
        name: bar('name'),
        color: bar('color'),
        heights: bar('height'),
        category: bar('category'),
        highlight_names: bar('highlight_names') ? bar('highlight_names').values : bar('height').labels,
        select: bar('select').which((value) => value)[0],
        similar: bar('similar') ? bar('similar').values : undefined
      })
    )
  }

  return {
    bars: bars,
    legend: null,//props.attribute.legend,
    plot: null //props.attribute.dimensions
  };
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

const BarPlotAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(BarPlotAttribute);

export default BarPlotAttributeContainer;
