import { headers, parseJSON, checkStatus } from './fetch_utils'

export const fetchManifests = (project_name, exchange)=>{
  let routeOpts = {
    'credentials': 'same-origin',
    'method': 'POST',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify({
      'project_name': project_name
    })
  };

  var exchangePromise = exchange.fetch(Routes.manifests_fetch_path(), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const createManifest = (project_name, manifest, exchange)=>{
  let routeOpts = {
    'credentials': 'same-origin',
    'method': 'POST',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify({
      'project_name': project_name,
      ...manifest
    })
  };

  var exchangePromise = exchange.fetch(Routes.manifests_create_path(), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const updateManifest = (project_name, manifestUpdates, manifestId, exchange)=>{
  let routeOpts = {
    'credentials': 'same-origin',
    'method': 'POST',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify({
      'project_name': project_name,
      ...manifestUpdates
    })
  };

  var exchangePromise = exchange.fetch(Routes.manifests_update_path(manifestId), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const destroyManifest = (manifestId, exchange)=>{
  let routeOpts = {
    'credentials': 'same-origin',
    'method': 'POST',
    'headers': headers('json', 'csrf')
  };

  var exchangePromise = exchange.fetch(Routes.manifests_destroy_path(manifestId), routeOpts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};
