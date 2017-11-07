import React from 'react'
import VectorResult from './vector_result'
import MatrixResult from './matrix_result'
import Vector from '../../models/vector'
import Matrix from '../../models/matrix'

const isPrimitiveType = (value) => typeof value === 'string' || typeof value === 'number' || value === null || typeof value === 'undefined'

export const manifestResult = (name, data, nestLevel = 0) => {
  if (isPrimitiveType(data)) {
    //display primitive type result
    return (
      <div className="result" style={{ marginLeft: nestLevel * 5 }}>
        {data}
      </div>
    )
  } else if (data instanceof Vector) {
    if (isPrimitiveType(data(0))) {
      //display a list/vector
      return (
        <div className="result" style={{marginLeft: nestLevel * 5 }}>
          <VectorResult vector={data} name={name}/>
        </div>
      )
    } else {
      //nested objects recursively call Result on each property
      return (
        <div className="result" style={{marginLeft: nestLevel * 5 }}>
          {data.map((label, value, index) => (
            <div key={index}>
              <span className='label'>{label}</span>
              { Result(label, value, nestLevel + 1) }
            </div>
          ))}
        </div>
      )
    }
  } else if (data instanceof Matrix) {
    return (
      <div className="result" style={{ marginLeft: nestLevel * 5 }}>
        <MatrixResult matrix={data} name={name} />
      </div>
    )
  } else if (data.hasOwnProperty('errors')) {
    //handle error result
    return <div className="result">{data.errors.join(', ')}</div>
  } else if (data.hasOwnProperty('error')) {
    return <div className="result">{data.error}</div>
  }
}
