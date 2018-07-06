import Vector from '../models/vector';
import Matrix from '../models/matrix';

/*
 * Converts a consignment JSON object from the store to an object, with Matrix
 * and Vector values instead of JSON.
 */

const ISO_FORMAT = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

const isDate = (value) => (
  typeof value === 'string' && value.match(ISO_FORMAT)
);

const isObject = (value) => (
  value != null && typeof value == 'object'
);

const isMatrix = (value) => (
 'matrix' in value && 'rows' in value.matrix && !(value.matrix instanceof Matrix)
);

const isVectorItem = (item) => (
  isObject(item) && 'label' in item && 'value' in item
);

const isVector = (value) => (
  'vector' in value && Array.isArray(value.vector) &&
  value.vector.every(isVectorItem)
)

const reviver = (key, value) => {
  if (isDate(value))
    return new Date(value);
  else if (isObject(value)) {
    if (isMatrix(value))
      return new Matrix(value.matrix);
    else if (isVector(value))
      return new Vector(value.vector);
    else
      return value;
  }
  else
    return value;
}

export default class Consignment{
  constructor(consignment){
    let parsed = JSON.parse(
      JSON.stringify(consignment),
      reviver
    );

    for (let name in parsed) this[name] = parsed[name];
  }


  matrixKeys(){
    return this.consignmentKeysByType(Matrix);
  }

  vectorKeys(){
    return this.consignmentKeysByType(Vector);
  }

  consignmentKeysByType(type){
    return Object.keys(this || {}).filter(k => this[k] instanceof type);
  };
}
