// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class HistogramAttribute extends React.Component{
  constructor(props){
    super(props);
    this.props.initialized(this.constructor.name);
  }

  render(){
    return(
      <div>

        {'Histogram Attribute'}
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

export const HistogramAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(HistogramAttribute);

/*

import { connect } from 'react-redux';

import React from 'react'
import Histogram from '../plots/histogram'
import { selectConsignment } from '../../selectors/consignment'

let HistogramAttribute = ({
  data,
  xmax,
  xmin,
  attribute: {
    plot: {
      interval,
      ymax,
      xLabel,
      yLabel,
      name,
      dimensions: {
        height,
        width,
        margin
      },
    }
  }
}) => (
  <div className="value">
    {data[0] &&
      <Histogram
        plot={{name, width, height}}
        margin={margin}
        data={data}
        xmin={xmin}
        xmax={xmax}
        interval={interval}
        ymax={ymax}
        xLabel={xLabel}
        yLabel={yLabel}
      />
    }
  </div>
)

HistogramAttribute = connect(
  (state, props) => {
    const { name } = props.attribute.plot
    const consignment = selectConsignment(state, name)

    if (consignment) {
      const { xmin, xmax, data} = consignment

      return {
        data: data.values,
        xmin,
        xmax
      }
    }

    return {
      data: []
    }
  }
)(HistogramAttribute)

export default HistogramAttribute
*/