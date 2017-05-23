import React from 'react'
import StackedBarPlot from './plots/stacked_bar_plot'

let StackedBarPlotAttribute = ({
  data,
  datumKey,
  properties,
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
    {data[0] &&
      <StackedBarPlot
        ymin={ymin}
        ymax={ymax}
        plot={{name, width, height}}
        margin={margin}
        data={data}
        properties={properties}
      />
    }
  </div>
)

StackedBarPlotAttribute = connect(
  (state, props) => {
    const { name, properties, order_by } = props.attribute.plot
    const consignment = timurActions.findManifest(state, name)
    if (consignment) {
      const allValues = consignment.data.map((label, value,) => {
        return value.map((valueLabel, value) => {
          return {
            id: valueLabel,
            [label]: value
          }
        })
      }).reduce((acc, curr) => [...acc, ...curr], [])

      const objectsOfValuesGroupedById = allValues.reduce((acc, curr) => {
        if (acc[curr.id]) {
          return {
            ...acc,
            [curr.id]: {
              ...acc[curr.id],
              ...curr
            }
          }
        } else {
          return {
            ...acc,
            [curr.id]: curr
          }
        }
      }, {})

      let data = Object.values(objectsOfValuesGroupedById)
      if (order_by) {
        data.sort((a, b) => a[order_by] - b[order_by])
      }

      return {
        data,
        properties
      }
    }

    return {
      data: [],
      properties
    }
  }
)(StackedBarPlotAttribute)

export default StackedBarPlotAttribute