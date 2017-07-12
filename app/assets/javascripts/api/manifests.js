import { headers, parseJSON, checkStatus } from './fetch_utils'

export const fetchManifests = ()=>{
  let routeOpts = {
    'credentials': 'same-origin',
    'headers': headers('json', 'csrf'),
  };

  fetch(Routes.manifests_path(), routeOpts)
    .then(checkStatus)
    .then(parseJSON);
};

export const createManifest = (manifest)=>{
  let routeOpts = {
    'credentials': 'same-origin',
    'method': 'POST',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify(manifest)
  };

  fetch(Routes.manifests_path(), routeOpts)
    .then(checkStatus)
    .then(parseJSON);
};

export const destroyManifest = (manifestId)=>{
  let routeOpts = {
    'credentials': 'same-origin',
    'headers': headers('json', 'csrf'),
    'method': 'DELETE'
  };

  fetch(Routes.manifest_path(manifestId), routeOpts)
    .then(checkStatus)
    .then(parseJSON);
};

export const updateManifest = (manifestUpdates, manifestId)=>{
  let routeOpts = {
    'credentials': 'same-origin',
    'method': 'PUT',
    'headers': headers('json', 'csrf'),
    'body': JSON.stringify(manifestUpdates)
  };

  fetch(Routes.manifest_path(manifestId), routeOpts)
    .then(checkStatus)
    .then(parseJSON);
};
