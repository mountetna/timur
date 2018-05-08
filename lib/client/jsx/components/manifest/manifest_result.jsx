import React from 'react';
import VectorResult from './vector_result';
import MatrixResult from './matrix_result';
import Vector from '../../models/vector';
import Matrix from '../../models/matrix';

const isPrimitiveType = (value)=>{
  return(
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === null ||
    typeof value === 'undefined'
  );
};

const renderPrimitive = (data, nest_level)=>{
  return(
    <div className='result' style={{marginLeft: nest_level * 5}}>

      {data}
    </div>
  );
};

const renderVector = (name, data, nest_level)=>{
  return(
    <div className='result' style={{marginLeft: nest_level * 5}}>

      <VectorResult vector={data} name={name} />
    </div>
  );
};

const renderMatrix = (name, data, nest_level)=>{
  return(
    <div className='result' style={{marginLeft: nest_level * 5}}>

      <MatrixResult matrix={data} name={name} />
    </div>
  );
};

export const manifestResult = (name, data, nest_level = 0)=>{

  // Display primitive type result.
  if(isPrimitiveType(data)){
    return renderPrimitive(data, nest_level);
  }
  else if(data instanceof Vector){

    // Display a list/vector.
    if(isPrimitiveType(data(0))){
      return renderVector(name, data, nest_level);
    }
  }
  else if(data instanceof Matrix){
    return renderMatrix(name, data, nest_level)
  }
  else if(data.hasOwnProperty('errors')){
    return <div className='result'>{data.errors.join(', ')}</div>
  }
  else if(data.hasOwnProperty('error')){
    return <div className='result'>{data.error}</div>
  }
};
