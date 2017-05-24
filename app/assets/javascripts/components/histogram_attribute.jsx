import React from 'react'
import Histogram from './plots/histogram'

let HistogramAttribute = ({
  data,
  attribute: {
    plot: {
      name,
      dimensions: {
        height,
        width,
        margin
      }
    }
  }
}) => (
  <div className="value">
    {data[0] &&
      <Histogram
        plot={{name, width, height}}
        margin={margin}
        data={data}
      />
    }
  </div>
)

HistogramAttribute = connect(
  (state, props) => {
    const { name } = props.attribute.plot
    const consignment = timurActions.findManifest(state, name)

    if (consignment) {
      return { data: consignment.data.values }
    }

    return {
      data: []
    }
  }
)(HistogramAttribute)

export default HistogramAttribute