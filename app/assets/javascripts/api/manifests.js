import { headers, parseJSON, checkStatus } from './fetch_utils'

export const fetchManifests = (exchange)=>{
  let routeOpts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf')
  };

  var exchangePromise = exchange.fetch(Routes.manifests_fetch_path(PROJECT_NAME), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const createManifest = (manifest, exchange)=>{
  let routeOpts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifest)
  };

  var exchangePromise = exchange.fetch(Routes.manifests_create_path(PROJECT_NAME), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const updateManifest = (manifestUpdates, manifest_id, exchange)=>{
  let routeOpts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifestUpdates)
  };

  var exchangePromise = exchange.fetch(Routes.manifests_update_path(PROJECT_NAME, manifest_id), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const destroyManifest = (manifest_id, exchange)=>{
  let routeOpts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf')
  };

  var exchangePromise = exchange.fetch(Routes.manifests_destroy_path(PROJECT_NAME, manifest_id), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const getConsignments = (manifests, exchange)=>{

  var routeOpts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({
      queries: manifests
    })
  };

  var exchangePromise = exchange.fetch(Routes.consignment_json_path(PROJECT_NAME), routeOpts)
    .then(checkStatus)
    .then(parseJSON)

  return exchangePromise;
};
