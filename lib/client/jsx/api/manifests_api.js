// Module imports.
import {headers, parseJSON, checkStatus} from '../utils/fetch_utils';

export const fetchManifests = (exchange)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'GET',
    headers: headers('json', 'csrf')
  };

  let exchangePromise = exchange.fetch(Routes.manifests_fetch_path(TIMUR_CONFIG.project_name), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const createManifest = (manifest, exchange)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifest)
  };

  let exchangePromise = exchange.fetch(Routes.manifests_create_path(TIMUR_CONFIG.project_name), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const updateManifest = (manifestUpdates, manifest_id, exchange)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(manifestUpdates)
  };

  let exchangePromise = exchange.fetch(Routes.manifests_update_path(TIMUR_CONFIG.project_name, manifest_id), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const destroyManifest = (manifest_id, exchange)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'DELETE',
    headers: headers('json', 'csrf')
  };

  let exchangePromise = exchange.fetch(Routes.manifests_destroy_path(TIMUR_CONFIG.project_name, manifest_id), route_opts)
    .then(checkStatus)
    .then(parseJSON);

  return exchangePromise;
};

export const getConsignments = (manifests, exchange)=>{

  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({queries: manifests.map(m=>m.script)})
  };

  let exchangePromise = exchange.fetch(Routes.consignment_path(TIMUR_CONFIG.project_name), route_opts)
    .then(checkStatus)
    .then(parseJSON)

  return exchangePromise;
};

export const getConsignmentsByManifestId = (manifest_ids, record_name, exchange)=>{

  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    body: JSON.stringify({manifest_ids, record_name})
  };

  let exchangePromise = exchange.fetch(Routes.consignment_path(TIMUR_CONFIG.project_name), route_opts)
    .then(checkStatus)
    .then(parseJSON)

  return exchangePromise;
};
