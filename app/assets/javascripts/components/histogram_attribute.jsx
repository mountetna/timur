import React from 'react'
import Histogram from './plots/histogram'

let HistogramAttribute = ({
  data,
  xmin,
  xmax,
  interval,
  ymax,
  attribute: {
    plot: {
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
      />
    }
  </div>
)

HistogramAttribute = connect(
  (state, props) => {
    const { name } = props.attribute.plot
    const consignment = timurActions.findManifest(state, name)

    if (consignment) {
      const { xmin, xmax, interval, ymax, data } = consignment
      console.log(consignment)

      return {
        data: data.values,
        xmin,
        xmax,
        interval,
        ymax
      }
    }

    return {
      data: []
    }
  }
)(HistogramAttribute)

export default HistogramAttribute