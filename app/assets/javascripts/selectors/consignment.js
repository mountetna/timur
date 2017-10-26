import { createSelector } from 'reselect';
import Vector from '../models/vector';
import Matrix from '../models/matrix';
import Consignment from '../models/consignment';

let ISO_FORMAT = /[+-]?\d{4}(-[01]\d(-[0-3]\d(T[0-2]\d:[0-5]\d:?([0-5]\d(.\d+)?)?([+-][0-2]\d:[0-5]\d)?Z?)?)?)?/

// Converts a consignment JSON object from the store to an object, with Matrix and Vector values instead of JSON


const selectConsignmentData = (state, manifest_name) => state.consignments[manifest_name]

// cached construction of a Consignment object from a given consignment JSON
export const selectConsignment = createSelector(
  selectConsignmentData,
  (consignment) => (consignment ? new Consignment(consignment) : null)
)
