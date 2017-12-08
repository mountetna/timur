import { createSelector } from 'reselect';
import Consignment from '../models/consignment';

const selectConsignmentData = (state, manifest_id) => state.consignments[manifest_id];

// cached construction of a Consignment object from a given consignment JSON
export const selectConsignment = createSelector(
  selectConsignmentData,
  (consignment) => (consignment ? new Consignment(consignment) : null)
);

/*
 * Get the consignment id's (which should be the same as the manifest ids). We 
 * can use this to tell which consignments have been loaded. This way we don't
 * fetch data that we alread have cached.
 */
export const getLoadedConsignmentIds = (state)=>{
  let ids = [];
  for(let key in state.consignments) ids.push(key);
  return ids;
};
