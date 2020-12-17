import {getMetisRoot} from '../api/metis_api';
import {Exchange} from './exchange_actions';

export const setMetisCookie = (dispatch, metis_url) => {
  // Make a single GET request to the given hostname, to get the METIS_UID_NAME cookie
  //    set on this client.
  let exchng = new Exchange(dispatch, `metis-uid-cookie`);
  return getMetisRoot(metis_url, exchng);
};
