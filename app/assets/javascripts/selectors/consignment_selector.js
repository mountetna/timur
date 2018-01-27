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
