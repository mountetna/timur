import React from 'react'
import Histogram from './plots/histogram'

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
    const { name,} = props.attribute.plot
    const consignment = timurActions.findManifest(state, name)

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