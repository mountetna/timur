import React from 'react'
import BarGraph from './plots/bar_graph'
import { selectConsignment } from '../selectors/consignment'

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
    {data[0] &&
      <BarGraph
        ymin={ymin}
        ymax={ymax}
        plot={{name, width, height}}
        margin={margin}
        data={data}
      />
    }
  </div>
)

BarGraphAttribute = connect(
  (state, props) => {
    const { name } = props.attribute.plot
    const consignment = selectConsignment(state, name)
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
