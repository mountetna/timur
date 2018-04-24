// Module imports.
import * as FetchUtils from '../utils/fetch_utils';

export const fetchManifests = ()=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: FetchUtils.headers('json', 'csrf')
  };

  let uri = Routes.manifests_fetch_path(PROJECT_NAME);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const createManifest = (manifest)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify(manifest)
  };

  let uri = Routes.manifests_create_path(PROJECT_NAME);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const updateManifest = (manifestUpdates, manifest_id)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify(manifestUpdates)
  };

  let uri = Routes.manifests_update_path(PROJECT_NAME, manifest_id);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const destroyManifest = (manifest_id)=>{
  let route_opts = {
    credentials: 'same-origin',
    method: 'POST',
    headers: FetchUtils.headers('json', 'csrf')
  };

  let uri = Routes.manifests_destroy_path(PROJECT_NAME, manifest_id);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const getConsignments = (manifests)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify({queries: manifests})
  };

  let uri = Routes.consignment_json_path(PROJECT_NAME);
  return FetchUtils.fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};

export const getConsignmentsByManifestId = (manifest_ids, record_name)=>{
  let route_opts = {
    method: 'POST',
    credentials: 'same-origin',
    headers: FetchUtils.headers('json', 'csrf'),
    body: JSON.stringify({manifest_ids, record_name})
  };

  let uri = Routes.consignment_by_manifest_id_json_path(PROJECT_NAME);
  return fetch(uri, route_opts)
    .then(FetchUtils.checkStatus)
    .then(FetchUtils.parseJSON);
};
