import { createSelector } from 'reselect';
import Consignment from '../models/consignment';


const selectConsignmentData = (state, manifest_name) => state.consignments[manifest_name];

// cached construction of a Consignment object from a given consignment JSON
export const selectConsignment = createSelector(
  selectConsignmentData,
  (consignment) => (consignment ? new Consignment(consignment) : null)
);
