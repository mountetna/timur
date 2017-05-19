import React from 'react'
import VectorResult from './vector_result'
import MatrixResult from './matrix_result'

const isPrimitiveType = (value) => typeof value === 'string' || typeof value === 'number' || value === null || typeof value === 'undefined'

export const Result = (name, data, nestLevel = 0) => {
  if (isPrimitiveType(data)) {
    //display primitive type result
    return (
      <div style={{ marginLeft: nestLevel * 5 }}>
        {data}
      </div>
    )
  } else if (Array.isArray(data) && data[0].label) {
    if (isPrimitiveType(data[0].value)) {
      //display a list/vector
      return (
        <div style={{marginLeft: nestLevel * 5 }}>
          <VectorResult dataList={data} name={name}/>
        </div>
      )
    } else {
      //nested objects recursively call Result on each property
      return (
        <div style={{marginLeft: nestLevel * 5 }}>
          {data.map((elem, index) => (
            <div key={index}>
              { Result(elem.label, elem.value, nestLevel + 1) }
            </div>
          ))}
        </div>
      )
    }
  } else if (data.hasOwnProperty('matrix')) {
    //display matrix
    const props = { ...data.matrix, name }
    return (
      <div style={{ marginLeft: nestLevel * 5 }}>
        <MatrixResult {...props} />
      </div>
    )
  } else if (data.hasOwnProperty('errors')) {
    //handle error result
    return <div>{data.errors.join(', ')}</div>
  } else if (data.hasOwnProperty('error')) {
    return <div>{data.error}</div>
  }
}
