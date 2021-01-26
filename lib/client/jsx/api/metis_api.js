import {checkStatus, headers} from 'etna-js/utils/fetch';

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
