import {checkStatus, headers} from '../utils/fetch_utils';

const metisGet = (url, exchange) => {
  return exchange
    .fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: headers('json')
    })
    .then(checkStatus);
};

export const getMetisRoot = (url, exchange) => {
  return metisGet(url, exchange);
};
