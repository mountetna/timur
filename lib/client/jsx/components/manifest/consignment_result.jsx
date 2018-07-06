import React from 'react';
import VectorResult from './vector_result';
import MatrixResult from './matrix_result';
import Vector from '../../models/vector';
import Matrix from '../../models/matrix';

const isPrimitiveType = (value)=> (
  typeof value === 'string' || typeof value === 'number' ||
  typeof value === 'boolean' || typeof value === 'undefined' ||
  typeof value === null
);

const isVector = (value) => (
  value instanceof Vector && isPrimitiveType(value(0))
);

const isMatrix = (value) => (value instanceof Matrix);

const ConsignmentResult = ({name, data, nestLevel}) =>
  <div className='result' style={{marginLeft: (nestLevel || 0) * 5}}>
    {
      isPrimitiveType(data) ?
        String(data)
      : isVector(data) ?
        <VectorResult vector={data} name={name} />
      : isMatrix(data) ?
        <MatrixResult matrix={data} name={name} />
      : null
    }
  </div>;

export default ConsignmentResult;
