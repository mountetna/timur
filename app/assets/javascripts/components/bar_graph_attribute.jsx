import React from 'react'
import BarGraph from './plots/bar_graph'

let BarGraphAttribute = ({
  data,
  datumKey,
  ymin,
  ymax,
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
    <BarGraph
      ymin={ymin}
      ymax={ymax}
      plot={{ name, width, height }}
      margin={margin}
      data={data}
    />
  </div>
)

BarGraphAttribute = connect(
  (state, props) => {
    const { name, properties } = props.attribute.plot
    const consignment = timurActions.findManifest(state, name)
    if (consignment) {
      const data = consignment.data.map((label, value,) => {
        return value.map((label, value) => ({ label, value })).reduce((acc, curr) => {
          return {
            ...acc,
            [curr.label]: curr.value
          }
        }, {})
      })

      return { data }
    }

      return {
        data: []
      }
  }
)(BarGraphAttribute)

export default BarGraphAttribute