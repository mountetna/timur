import React from 'react';
import VectorResult from './vector_result';
import MatrixResult from './matrix_result';
import { isPrimitiveType, isVector, isMatrix } from '../../utils/types'

const ConsignmentResult = ({name, data}) =>
  <div className='consignment-result'>
    {
      isPrimitiveType(data) ?
        <div className='primitive-value'>
          { String(data) }
        </div>
      : isVector(data) ?
        <VectorResult vector={data} name={name} />
      : isMatrix(data) ?
        <MatrixResult matrix={data} name={name} />
      : null
    }
  </div>;

export default ConsignmentResult;
