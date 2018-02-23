import Vector from '../models/vector';
import Matrix from '../models/matrix';

const ISO_FORMAT = /[+-]?\d{4}(-[01]\d(-[0-3]\d(T[0-2]\d:[0-5]\d:?([0-5]\d(.\d+)?)?([+-][0-2]\d:[0-5]\d)?Z?)?)?)?/;

/* 
 * Converts a consignment JSON object from the store to an object, with Matrix
 * and Vector values instead of JSON.
 */
export default class Consignment{
  constructor(consignment){
    let parsed = JSON.parse(
      JSON.stringify(consignment),
      this.reviver.bind(this)
    );

    for(let name in parsed) this[name] = parsed[name];
  }

  reviver(key, value){
    if(typeof value === 'string' && value.match(ISO_FORMAT)){
      return new Date(value);
    }
    else if(value != null && typeof value == 'object'){
      if('matrix' in value && 'rows' in value.matrix){
        return new Matrix(value.matrix);
      }
      else if(
        'vector' in value &&
        Array.isArray(value.vector) &&
        value.vector.every(this.everyCheck.bind(this))
      ){
        return new Vector(value.vector);
      }
      else{
        return value;
      }
    }
    else{
      return value;
    }
  }

  everyCheck(item){
    return (
      item != null &&
      typeof item === 'object' &&
      'label' in item &&
      'value' in item
    );
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
