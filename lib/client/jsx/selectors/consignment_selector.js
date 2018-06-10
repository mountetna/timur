// Framework libraries.
import * as Reselect from 'reselect';

// Class imports.
import Consignment from '../models/consignment';

const selectConsignmentData = (state, manifest_md5sum)=>{
  return state.consignments[manifest_md5sum];
};

// A cached construction of a Consignment object from a given consignment JSON.
export const selectConsignment = Reselect.createSelector(
  selectConsignmentData,
  (consignment_data)=>{
    return (consignment_data ? new Consignment(consignment_data) : null);
  }
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
