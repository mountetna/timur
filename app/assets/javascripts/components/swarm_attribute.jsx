import React from 'react'
import Swarm from './plots/swarm'

let SwarmAttribute = ({
  data,
  attribute: {
   plot: {
     xLabel,
     yLabel,
     xmin,
     xmax,
     name,
     dimensions: {
       height,
       width,
       margin
     }
   }
  }
}) => (
  <div className='value'>
    {data[0] &&
      <Swarm
        data={data}
        plot={{name, width, height}}
        margin={margin}
        xmin={xmin}
        xmax={xmax}
        xLabel={xLabel}
        yLabel={yLabel}
      />
    }
  </div>
)

SwarmAttribute = connect(
  (state, props) => {
    const { name, calculated_columns } = props.attribute.plot
    const consignment = timurActions.findManifest(state, name)

    if (consignment) {
      const dataMatrix = consignment.data

      let data = [];

      //create rows from matrix
      for (let i = 0; i < dataMatrix.num_rows; i++) {
        let row = {}

        //create row by adding columns as attributes
        for (let j = 0; j < dataMatrix.num_cols; j++) {
          row = {
           ...row,
           [dataMatrix.col_name(j)]: dataMatrix.row(i)[j]
          }
        }

        //add calculated_columns as attributes
        const calculatedColumns = calculated_columns.reduce((acc, curr) => {
          return {
            ...acc,
            [curr]: consignment[curr][i]
          }
        }, {})
        row = {...row, ...calculatedColumns}

        data.push(row)
      }

      return { data }
    }

    return { data: [] }
  }
)(SwarmAttribute)

export default SwarmAttribute